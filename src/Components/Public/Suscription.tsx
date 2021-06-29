import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, Paper, List, ListItem, ListItemIcon } from '@material-ui/core';
import { ListItemText, TextField, Grid, Fab, Button } from '@material-ui/core';

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isRol as rolChecker } from '../../Functions/isRol';
import { SettingsRemote } from '@material-ui/icons';

export const Suscription = () => {
  const dateLimit = new Date('2017-12-31');

  //hooks
  const [setADisable, setStepADisable] = React.useState(false);
  const [isRol, setIsRol] = React.useState<boolean | null>(null);

  //React hook form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Input>();

  type Input = {
    rut: string;
  };

  //Return stactic content
  const titleMessage = (
    <React.Fragment>
      <Typography variant='h5' color='primary'>
        aquí puedes inscribirte al taller
      </Typography>
      <Typography variant='body1' color='initial'>
        recuerde tener su carnet💳 a mano 🙌{' '}
      </Typography>
    </React.Fragment>
  );

  const requirementList = [
    {
      main: 'haber sido convocad@ por un servicio público válidado',
      sub: 'un municipio o servicio público con convenio vigente',
    },
    {
      main: 'haberse inscrito en esta mini app',
      sub: 'on-line sin salir de casa 🏡',
    },
    {
      main: 'pertenecer al registro social de hogares',
      sub: 'y tener menos del 70% RSH',
    },
    {
      main: 'beneficiado único en el grupo familiar',
      sub: 'solo se permite un Kit por hogar',
    },
    {
      main: `no haya recibido Kit después de esta fecha`,
      sub: dateLimit.toLocaleDateString(),
    },
    {
      main: `participar y validar su asistencia al taller inscrito`,
      sub: 'para validar use botón "VALIDA" ingresando su firma',
    },
  ];
  const requirements = (
    <React.Fragment>
      <Paper>
        <Box p={1}>
          <Typography variant='subtitle1' color='primary'>
            requisitos para recibir el beneficio del kit de ahorro 💡
          </Typography>
        </Box>
        <Box p={2} mt={0}>
          <List dense={true}>
            {requirementList.map((item, index) => {
              return (
                <ListItem>
                  <ListItemIcon>
                    <CheckBoxIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary={item.main} secondary={item.sub} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Paper>
    </React.Fragment>
  );

  //form step
  const onSubmitStepA: SubmitHandler<Input> = (data) => {
    console.log('register', 'step A', true);
    console.log('submit A', data);

    //checking rut
    setIsRol(rolChecker(data.rut));
    console.log('is rol valid?', isRol);

    //setStepADisable(true);
  };

  const stepAform = (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmitStepA)}>
        <Paper elevation={2}>
          <Grid
            container
            direction='row'
            spacing={1}
            justify='space-between'
            alignItems='center'
          >
            <Grid item xs={3}>
              <Typography variant='subtitle2' color='primary'>
                Paso 1
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <TextField
                required
                disabled={setADisable}
                id='check-rut'
                label='verifica rut'
                type='text'
                variant='filled'
                {...register('rut', {
                  pattern: {
                    value: /^\d{7,8}[-]{1}[Kk\d]{1}$/,
                    message: 'rut inválido: sin puntos 🙅‍♂️, con guión 👌',
                  },
                })}
                error={errors.rut && true}
                helperText={errors.rut?.message}
              />
              {isRol}
            </Grid>

            <Grid item xs={2}>
              <Button
                type='submit'
                variant='outlined'
                color='primary'
                disabled={setADisable}
              >
                Check
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {titleMessage}
      <br />
      {stepAform}
      <br />
      {requirements}
    </React.Fragment>
  );
};
