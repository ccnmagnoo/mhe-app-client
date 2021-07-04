import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, Grid, Avatar, CardHeader } from '@material-ui/core';
import myOldData from '../../Config/mhe-data-rooms.json';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IClassroom } from '../../Models/Classroom.interface';
import { LandType } from '../../Functions/GetTerritoryList';

type InputJson = {
  city: string;
  dataInstance: string;
  dir: string;
  colaborator: string;
  uuid: string;
  idcal: string;
};

export const Welcome = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader
          avatar={<Avatar aria-label='W'>👋</Avatar>}
          title='Bienvenidos a la mini app '
          subheader='Incribete y valida on-line'
        />
        <CardContent>
          <Grid container spacing={3} justify='center'>
            <Grid item>
              <Typography variant='subtitle1' color='inherit' align='justify' paragraph>
                con esta mini app podrás suscribirte a los talleres y posteriormente
                podrás validar tu asistencia a los Talleres de capacitación de{' '}
                <strong>Seremi Energía Valparaíso</strong> de forma{' '}
                <strong>on-line</strong>.
              </Typography>
              <Typography variant='caption' color='initial' paragraph>
                {' '}
                Si tienes dudas escribenos a{' '}
                <a href='mailto:ccamposn@minenergia.cl'>ccamposn@minenergia.cl</a>{' '}
              </Typography>
              <Typography variant='caption' color='initial'>
                {' '}
                Popipo🦜Soft &trade;
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
