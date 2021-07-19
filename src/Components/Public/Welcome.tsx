import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, Grid, Avatar, CardHeader, Chip } from '@material-ui/core';
import popipo from '../../Assets/popiposoft.svg';
import EmailIcon from '@material-ui/icons/Email';

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
                <Chip
                  avatar={<EmailIcon />}
                  label='@EnergíaValpo'
                  component='a'
                  href='mailto:ccamposn@minenergia.cl'
                  color='primary'
                  clickable
                />
              </Typography>
              <Typography variant='caption' color='initial'>
                {' '}
                Popipo
                <img className='button' src={popipo} alt='logo taller' width={20} />
                Soft &trade;
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
