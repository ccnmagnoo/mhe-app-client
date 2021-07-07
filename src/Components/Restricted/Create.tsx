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
import { withRouter } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import { capitalWord } from '../../Functions/capitalWord';
import {
  getCityList,
  getTerritoryNames,
  LandType,
} from '../../Functions/GetTerritoryList';
import { pad } from '../../Functions/paddingNumber';
import { IClassroom } from '../../Models/Classroom.interface';

const Create = (props: any) => {
  //router
  //let { path, url } = useRouteMatch();

  //Land type and land list
  const [landList, setLandList] = React.useState<string[]>([]);
  const [placeDate, setPlaceDate] = React.useState<Date>(new Date());
  const [postDate, setPostDate] = React.useState<Date>(new Date());
  const [error, setError] = React.useState<string | null>(null);

  //set form inputs init state
  const initInput: Input = {
    idCal: 0,
    colaborator: '',
    placeName: '',
    placeDir: '',
    placeDate: new Date(),
    postName: '',
    postDir: '',
    postDate: new Date(),
    landType: LandType.city,
    landName: 'Valparaíso',
    vacancies: 10,
  };
  const [inputData, setInputData] = React.useState<Input>(initInput);

  //on Input OnChange🔃
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(`working: ${e.target.name}:${e.target.value}`);
    //update de los props onChange en la medida que se escriben
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  }

  //LandType
  const [landType, setLandType] = React.useState<LandType>(LandType.city);

  const handleLandTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLandType(event.target.value as LandType);
    setInputData({ ...inputData, landType: event.target.value as string });
  };

  //Land Name
  const handleLandNameChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setInputData({ ...inputData, landName: value ?? 'Valparaíso' });
  };

  React.useEffect(() => {
    //for each change of land type, populate autocomplete list
    console.log('land type input state:', landType);
    setLandList(getTerritoryNames(landType));
  }, [landType]);

  const handlePlaceDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //set state activity time
    const newDatePlace = event.target.value as Date;

    setPlaceDate(newDatePlace);
    //set state delivery time
    setPostDate(newDatePlace);
    //set state input
    setInputData({ ...inputData, placeDate: newDatePlace });
  };
  const handlePostDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newPostDate = event.target.value as Date;

    //set state delivery time
    setPostDate(newPostDate);
    //set state of inputs
    setInputData({ ...inputData, postDate: newPostDate });
  };

  const {
    register,
    handleSubmit,
    //watch,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmit() {
    console.log('create', 'on init', true);
    console.log('create', JSON.stringify(inputData));
    createClassRoom();
  }

  const createClassRoom = async () => {
    try {
      if (inputData !== null) {
        //firestore🔥🔥🔥
        const db = firebase.firestore();
        const req = db
          .collection('Activity')
          .doc(auth.currentUser?.uid)
          .collection('Classroom')
          .doc();

        //build object function
        const buildObject = (data: Input, uuid: string) => {
          const listOfCities = getCityList(data.landName, data.landType as LandType);
          const datePlaceSetting = new Date(data.placeDate);
          const datePostSetting = new Date(data.postDate);

          //Add input: vancancies allowed
          const classRoom: IClassroom = {
            uuid: uuid,
            idCal: `R${pad(data.idCal, 3)}`,
            colaborator: capitalWord(data.colaborator),
            enrolled: [],
            attendees: [],
            dateInstance: datePlaceSetting,
            vacancies: data.vacancies,
            placeActivity: {
              name: data.placeName,
              dir: data.placeDir,
              date: datePlaceSetting,
            },

            placeDispatch: {
              name: capitalWord(data.postName),
              dir: data.postDir,
              date: datePostSetting,
            },
            allowedCities: listOfCities,
            cityOnOp: listOfCities[0],
            land: { type: data.landType as LandType, name: data.landName },
          };
          return classRoom;
        };

        //Return classoom with UUID
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
    idCal: number;
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
    vacancies: number;
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='flex-start'
            alignItems='center'
            wrap='wrap'
          >
            <Grid item xs={12}>
              <Typography variant='subtitle1' color='primary'>
                nueva actividad
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <TextField
                required
                id='standard-required'
                label='idCal'
                type='number'
                variant='outlined'
                {...register('idCal', {
                  max: { value: 999, message: 'muy grande' },
                  min: { value: 1, message: 'no menor a 0' },
                })}
                onChange={handleInputChange}
                error={errors.idCal && true}
                helperText={errors.idCal?.message}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              {/*date picker 📆📅📆*/}
              <TextField
                id='datetime-local'
                type='datetime-local'
                label='fecha/hora'
                variant='outlined'
                color='primary'
                value={placeDate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...register('placeDate')}
                error={errors.placeDate && true}
                helperText={errors.placeDate && true ? 'en el pasado?' : undefined}
                onChange={handlePlaceDateChange}
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              {/*lugar🔰📌*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label=' nombre lugar'
                variant='outlined'
                inputProps={{ style: { textTransform: 'capitalize' } }}
                fullWidth
                {...register('placeName', {})}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
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
                  id='land-type-selector'
                  value={inputData.landType}
                  onChange={handleLandTypeChange}
                >
                  <MenuItem value={LandType.region}>Regional</MenuItem>
                  <MenuItem value={LandType.province}>Provincial</MenuItem>
                  <MenuItem value={LandType.city}>Comunal</MenuItem>
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
            <Grid item xs={6} sm={5}>
              <TextField
                required
                id='standard-required'
                label='cupos'
                type='number'
                variant='outlined'
                {...register('vacancies', {
                  max: { value: 400, message: 'muy grande' },
                  min: { value: 10, message: 'muy pocos' },
                })}
                onChange={handleInputChange}
                error={errors.vacancies && true}
                helperText={errors.vacancies?.message}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
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

            <Grid item xs={12} sm={5}>
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
            <Grid item xs={12} sm={7}>
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
              {error !== null ? <Alert severity='error'>{error}</Alert> : undefined}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default withRouter(Create);
