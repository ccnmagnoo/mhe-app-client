import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grow,
} from '@material-ui/core';
import React from 'react';
import { dateLimit } from '../../Config/credential';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import moment from 'moment';

export const Requirements = () => {
  const requirementList = [
    {
      main: 'haber sido convocad@ por un servicio público válidado',
      sub: 'un municipio o servicio público con convenio vigente',
    },
    {
      main: 'haberse inscrito en esta mini app',
      sub: 'pre-inscripción online sin salir de casa 🏡',
    },
    {
      main: 'pertenecer al registro social de hogares',
      sub: 'y tener menos del 70% RSH',
    },
    {
      main: 'ser beneficiado único en el grupo familiar',
      sub: 'solo un Kit por hogar',
    },
    {
      main: `no haber sido beneficiario del Kit después de la fecha límite`,
      sub: moment(dateLimit).format('DD [de] MMMM [de año] YYYY'),
    },
    {
      main: `participar y validar su asistencia al taller inscrito`,
      sub: 'debe anunciar su asistencia en cada taller con nombre y rut',
    },
  ];

  return (
    <React.Fragment>
      <Grow in={true}>
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
                  <ListItem key={index}>
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
      </Grow>
    </React.Fragment>
  );
};
