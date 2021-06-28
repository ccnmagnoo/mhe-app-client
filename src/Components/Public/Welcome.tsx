import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, Grid, Avatar, CardHeader } from '@material-ui/core';

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
              <Typography variant='subtitle1' color='inherit'>
                aquí te podrás suscribirte previo a los talleres y posteriormente podrás
                validar tu asistencia a los Talleres de capacitación de{' '}
                <strong>Seremi Energía Valparaíso</strong> .
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
