import {
  Paper,
  TextField,
  Typography,
  Grid,
  Container,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextFieldProps,
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import firebase from 'firebase';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import {
  getCityList,
  getTerritoryNames,
  LandType,
} from '../../Functions/GetTerritoryList';
import { IClassroom } from '../../Models/Classroom.interface';

const Create = (props: any) => {
  //router
  let { path, url } = useRouteMatch();

  //Land type and land list
  const [landList, setLandList] = React.useState<string[]>([]);
  const [placeDate, setPlaceDate] = React.useState<Date>(new Date());
  const [postDate, setPostDate] = React.useState<Date>(new Date());
  const [error, setError] = React.useState<string | null>(null);

  //set form inputs init state
  const initInput: Input = {
    idCal: '',
    colaborator: '',
    placeName: '',
    placeDir: '',
    placeDate: new Date(),
    postName: '',
    postDir: '',
    postDate: new Date(),
    landType: LandType.city,
    landName: 'Valparaíso',
  };
  const [inputData, setInputData] = React.useState<Input>(initInput);

  //on Input OnChange🔃
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(`working: ${e.target.name}:${e.target.value}`);
    //update de los props onChange en la medida que se escriben
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  }

  //LandType
  const [landType, setLandType] = React.useState<LandType>(LandType.region);
  const handleLandTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLandType(event.target.value as LandType);
    setInputData({ ...inputData, landType: event.target.value as string });
  };

  //Land Name
  const handleLandNameChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setInputData({ ...inputData, landName: value ?? 'Valparaíso' });
  };

  React.useEffect(() => {
    setLandList(getTerritoryNames(landType));
  }, [landType]);

  const handlePlaceDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //set state activity time
    setPlaceDate(event.target.value as Date);
    //set state delivery time
    setPostDate(event.target.value as Date);
    //set state input
    setInputData({ ...inputData, placeDate: event.target.value as Date });
  };
  const handlePostDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //set state delivery time
    setPostDate(event.target.value as Date);
    //set state of inputs
    setInputData({ ...inputData, postDate: event.target.value as Date });
  };

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const createClassRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    console.log('create', 'on init', true);
    console.log('create', JSON.stringify(inputData));
    try {
      if (inputData !== null) {
        //firestore🔥🔥🔥
        const db = firebase.firestore();
        const req = await db
          .collection('Activity')
          .doc(auth.currentUser?.uid)
          .collection('Classroom')
          .doc();
        //build object function
        const buildObject = (inputData: Input, uuid: string) => {
          const listOfCities = getCityList(
            inputData.landName,
            inputData.landType as LandType
          );

          const classRoom: IClassroom = {
            uuid: uuid,
            idCal: `R${inputData.idCal}`,
            dateInstance: inputData.placeDate,
            colaborator: inputData.colaborator,
            enrolled: [],
            attendees: [],
            placeActivity: {
              name: inputData.placeName,
              dir: inputData.placeDir,
              date: inputData.placeDate,
            },

            placeDispatch: {
              name: inputData.postName,
              dir: inputData.postDir,
              date: inputData.postDate,
            },
            allowedCities: listOfCities,
            cityOnOp: listOfCities[0],
          };
          return classRoom;
        };
        //return classoom with UUID
        const newClassroom = buildObject(inputData, req.id);

        await req.set(newClassroom);

        reset();
        setError(null);
        props.history.push('/dashboard');
      }
    } catch (error) {
      console.log('create classroom', false, error);
      setError('no se pudo cargar actividad 🎃');
    }
  };

  type Input = {
    idCal: string;
    colaborator: string;
    //place class 📌
    placeName: string;
    placeDir: string;
    placeDate: Date;
    //objective land 🗾🗺
    landType: string;
    landName: string;
    //place delivery🚚
    postName: string;
    postDir: string;
    postDate: Date;
  };

  return (
    <Container maxWidth='sm'>
      <br />
      <Paper
        elevation={3}
        style={{
          padding: 15,
        }}
      >
        <form onSubmit={createClassRoom}>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='center'
            alignItems='center'
            wrap='wrap'
          >
            <Grid item xs={12}>
              <Typography variant='subtitle1' color='primary'>
                nueva actividad
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id='standard-required'
                label='idCal'
                type='number'
                variant='outlined'
                {...register('idCal', {
                  max: { value: 1000, message: 'muy grande' },
                  min: { value: 0, message: 'no negativo' },
                })}
                onChange={handleInputChange}
                error={errors.idCal && true}
                helperText={errors.idCal?.message}
              />
            </Grid>
            <Grid item xs={8}>
              {/*date picker 📆📅📆*/}
              <TextField
                id='datetime-local'
                type='datetime-local'
                label='fecha/hora'
                variant='outlined'
                color='primary'
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...register('placeDate', {
                  validate: { morThan: (v) => v > Date.now() },
                })}
                error={errors.placeDate && true}
                helperText={errors.placeDate && true ? 'en el pasado?' : undefined}
                onChange={handlePlaceDateChange}
              />
            </Grid>

            <Grid item xs={5}>
              {/*lugar🔰📌*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='lugar'
                variant='outlined'
                inputProps={{ style: { textTransform: 'capitalize' } }}
                fullWidth
                {...register('placeName', {})}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={7}>
              {/*dirección o url*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='dirección'
                variant='outlined'
                inputProps={{ style: { textTransform: 'capitalize' } }}
                fullWidth
                {...register('placeDir', {})}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                variant='outlined'
                id='standard-required'
                label='contraparte organizadora'
                type='text'
                inputProps={{ style: { textTransform: 'capitalize' } }}
                {...register('colaborator', {})}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle2' color='primary'>
                Depliege territorial 🌐
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <FormControl
                required
                variant='filled'
                fullWidth
                {...register('landType', {})}
              >
                <InputLabel id='type selector'>tipo</InputLabel>
                <Select
                  labelId='type selector'
                  id='demo-simple-select-required'
                  value={inputData.landType}
                  onChange={handleLandTypeChange}
                >
                  <MenuItem value={LandType.city}>Comunal</MenuItem>
                  <MenuItem value={LandType.province}>Provincial</MenuItem>
                  <MenuItem value={LandType.region}>Regional</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={7}>
              <Autocomplete
                id='combo-box-demo'
                options={landList}
                {...register('landName', {})}
                onChange={handleLandNameChange}
                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                  <TextField
                    {...params}
                    required
                    label='territorio'
                    variant='filled'
                    error={errors.land && true}
                    helperText={errors.land && true ? 'nombre requerido' : undefined}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle2' color='primary'>
                Punto de entrega 🚚
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/*date delivery Picker 📆📅*/}
              <TextField
                id='datetime-local'
                type='datetime-local'
                label='fecha/hora'
                variant='outlined'
                color='primary'
                value={postDate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...register('postDate', {
                  validate: { lessThan: (v: Date) => v >= placeDate },
                })}
                onChange={handlePostDateChange}
                error={errors.postDate && true}
                helperText={
                  errors.postDate && true ? 'no puedes antes de la actividad' : undefined
                }
              />
            </Grid>

            <Grid item xs={5}>
              {/*lugar🔰📌*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='lugar entrega'
                variant='outlined'
                fullWidth
                inputProps={{ style: { textTransform: 'capitalize' } }}
                {...register('postName', {})}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={7}>
              {/*address 🗺🦝🗾*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='dirección'
                variant='outlined'
                fullWidth
                inputProps={{ style: { textTransform: 'capitalize' } }}
                {...register('postDir', {})}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' color='primary' type='submit' fullWidth>
                crear
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Alert severity='error'>{error}</Alert>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default withRouter(Create);
