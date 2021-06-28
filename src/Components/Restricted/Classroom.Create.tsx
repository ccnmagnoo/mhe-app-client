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
import { useForm } from 'react-hook-form';
import { cities, City } from '../../Assets/cities';
import { getTerritoryNames, TerritoryType } from '../../Functions/GetTerritoryList';

export const ClassroomCreate = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  //Land type and land list
  const [landType, setLandType] = React.useState<TerritoryType>(TerritoryType.region);
  const [landList, setLandList] = React.useState<string[]>([]);

  React.useEffect(() => {
    setLandList(getTerritoryNames(landType));
  }, [landType]);

  const handleLandTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLandType(event.target.value as TerritoryType);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <Container maxWidth='xs'>
      <br />
      <Paper
        elevation={3}
        style={{
          padding: 15,
        }}
      >
        <form autoComplete='off'>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='center'
            alignItems='center'
            wrap='wrap'
          >
            <Grid item xs={12}>
              <Typography variant='h6' color='initial'>
                nueva actividad
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='standard-required'
                label='idCal'
                type='number'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={6}>
              {/*date picker 📆📅*/}
              <TextField
                id='standard-required'
                type='date'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              {/*time picker 🕒🕔🕕*/}
              <TextField
                id='standard-required'
                type='time'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              {/*lugar*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='nombre lugar'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={7}>
              {/*lugar*/}
              <TextField
                required
                id='standard-required'
                type='text'
                label='dirección o url'
                variant='outlined'
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant='outlined'
                id='standard-required'
                label='contraparte'
                type='text'
                inputProps={{ style: { textTransform: 'capitalize' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle2' color='primary'>
                Depliege territorial
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
                  <MenuItem value={TerritoryType.city}>Comunal</MenuItem>
                  <MenuItem value={TerritoryType.province}>Provincial</MenuItem>
                  <MenuItem value={TerritoryType.region}>Regional</MenuItem>
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
                    {...register('land', {})}
                    error={errors.land && true}
                    helperText={errors.land && true ? 'nombre requerido' : undefined}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}></Grid>
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
