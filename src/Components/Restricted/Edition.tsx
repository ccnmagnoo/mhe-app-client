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
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { getTerritoryNames, LandType } from '../../Functions/GetTerritoryList';

import EditAttributesIcon from '@material-ui/icons/EditAttributes';

export const Edit = () => {
  //Land type and land list
  const [landType, setLandType] = React.useState<LandType>(LandType.region);
  const [landList, setLandList] = React.useState<string[]>([]);
  const [selectDate, setSelectDate] = React.useState<Date>(new Date());
  const [postDate, setPostDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    setLandList(getTerritoryNames(landType));
  }, [landType]);

  const handleLandTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLandType(event.target.value as LandType);
  };

  const handlePlaceDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectDate(event.target.value as Date);
    setPostDate(event.target.value as Date);
  };
  const handlePostDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPostDate(event.target.value as Date);
  };

  const {
    register,
    handleSubmit,
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
    //place class 📌
    place: { name: string; dir: string; date: Date };
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
        <form autoComplete='on' onSubmit={handleSubmit(onSubmit)}>
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
                <EditAttributesIcon /> modificar actividad
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled
                id='standard-required'
                label='idCal'
                type='number'
                variant='filled'
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
                helperText={errors.placeDate && true ? 'en el pasado?' : undefined}
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
              />
            </Grid>
            <Grid item xs={7}>
              {/*address 🚒🚕*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='dirección'
                variant='outlined'
                inputProps={{ style: { textTransform: 'capitalize' } }}
                fullWidth
                {...register('placeDir', {})}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                variant='filled'
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
              <FormControl required variant='filled' fullWidth disabled>
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
                disabled
                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                  <TextField
                    {...params}
                    label='territorio'
                    variant='filled'
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
                value={postDate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...register('postDate', {
                  validate: { lessThan: (v: Date) => v >= selectDate },
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
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' color='primary' type='submit' fullWidth>
                crear
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
