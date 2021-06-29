import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, Paper, List, ListItem, ListItemIcon } from '@material-ui/core';
import moment from 'moment';

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ListItemText, TextField, Grid } from '@material-ui/core';

export const Suscription = () => {
  const dateLimit = new Date('2017-12-31');

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
      main: `el grupo familiar no haya recibido Kit después de esta fecha`,
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

  const stepAform = (
    <React.Fragment>
      <Paper elevation={2}>
        <Grid container spacing={1} justify='flex-start'>
          <Grid item xs={6}>
            <Typography variant='h6' color='initial'>
              Paso 1
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id='check-rut'
              label='verifica rut'
              variant='filled'
              onChange={(params) => {}}
            />
          </Grid>
        </Grid>
      </Paper>
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
