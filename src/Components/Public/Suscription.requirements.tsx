import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import { dateLimit } from '../../Config/credential';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

export const Requirements = () => {
  const requirementList = [
    {
      main: 'haber sido convocad@ por un servicio público válidado',
      sub: 'un municipio o servicio público con convenio vigente',
    },
    {
      main: 'haberse inscrito en esta mini app',
      sub: 'on-line sin salir de casa 🏡, antes del taller',
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

  return (
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
};
