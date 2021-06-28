import {
  Paper,
  TextField,
  Typography,
  Grid,
  Container,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextFieldProps,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { cities, City } from '../../Assets/cities';
import { getTerritoryNames, LandType } from '../../Functions/GetTerritoryList';
import { IClassroom } from '../../Models/Classroom.interface';
import { IPlace } from '../../Models/Place.interface';

export const ClassroomCreate = () => {
  //Land type and land list
  const [landType, setLandType] = React.useState<LandType>(LandType.region);
  const [landList, setLandList] = React.useState<string[]>([]);
  const [selectDate, setSelectDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    setLandList(getTerritoryNames(landType));
  }, [landType]);

  const handleLandTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLandType(event.target.value as LandType);
  };

  const handlePlaceDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectDate(event.target.value as Date);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Input> = (data, e) => {
    e?.preventDefault();
    console.log('login', data);

    e?.target.reset();
    reset();
  };

  type Input = {
    idCal: string;
    colaborator: string;
    //place class 📌
    place: { name: string; dir: string; date: Date };
    //objective land 🗾🗺
    landType: LandType;
    landName: string;
    //place delivery🚚
    post: { name: string; dir: string; date: Date };
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
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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
                error={errors.idCal && true}
                helperText={errors.idCal?.message}
              />
            </Grid>
            <Grid item xs={8}>
              {/*date picker 📆📅*/}
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
                onChange={handlePlaceDateChange}
                helperText={errors.placeDate && true ? 'fecha pasada' : undefined}
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
                fullWidth
                {...register('placeName', {})}
              />
            </Grid>
            <Grid item xs={7}>
              {/*lugar*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='dirección'
                variant='outlined'
                fullWidth
                {...register('placeDir', {})}
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
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle2' color='primary'>
                Depliege territorial 🌐
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <FormControl required variant='filled' fullWidth>
                <InputLabel id='demo-simple-select-required-label'>tipo</InputLabel>
                <Select
                  labelId='demo-simple-select-required-label'
                  id='demo-simple-select-required'
                  value={landType}
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
                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                  <TextField
                    {...params}
                    label='territorio'
                    variant='filled'
                    required
                    {...register('landName', {})}
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
                value={selectDate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...register('postDate', {
                  validate: { morThan: (v) => v > Date.now() },
                })}
                error={errors.placeDate && true}
                helperText={errors.placeDate && true ? 'fecha pasada' : undefined}
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
                {...register('postName', {})}
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
                {...register('postDir', {})}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' color='primary' fullWidth>
                crear
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
