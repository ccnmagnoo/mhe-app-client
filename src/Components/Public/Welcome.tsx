import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  Card,
  CardContent,
  Grid,
  Avatar,
  CardHeader,
  Chip,
  Link,
} from '@material-ui/core';
import popipo from '../../Assets/popiposoft.svg';
import EmailIcon from '@material-ui/icons/Email';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { NavLink } from 'react-router-dom';
import { currentContext } from '../../Models/Program';

export const Welcome = () => {
  const mailTo = `mailto:ccamposn@minenergia.cl?subject=${encodeURIComponent(
    `consulta desde app ${currentContext.program}`
  )}&body=${encodeURIComponent(
    `Junto con saludar, mi nombre es {nombre} de la comuna de {comuna}, escribo por el siguiente motivo:`
  )}`;

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          avatar={<Avatar aria-label='W'>👋</Avatar>}
          title='Bienvenidos a la mini app '
          subheader='Inscríbase y valide on-line'
        />
        <CardContent>
          <Grid container spacing={3} justify='center'>
            <Grid item>
              <Typography variant='subtitle1' color='inherit' align='justify' paragraph>
                con esta mini app podrás{' '}
                <Link component={NavLink} to='/subscription' color='primary'>
                  <strong>inscribirte a nuestras actividades</strong>
                </Link>{' '}
                y posteriormente podrás validar tu asistencia al programa de{' '}
                {currentContext.goal}
                <strong> {currentContext.program}</strong> de forma{' '}
                <strong>on-line</strong>.
              </Typography>
              <Typography
                variant='caption'
                color='initial'
                paragraph
                style={{
                  position: 'relative',
                  alignItems: 'flex-start',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                }}
              >
                Puedes ingresar <br /> aquí 👉
                {/* <Chip
                  avatar={<HowToRegIcon />}
                  label='Inscripción'
                  component={NavLink}
                  to='/subscription'
                  color='primary'
                  clickable
                  style={{ padding: '1rem' }}
                /> */}
                <a
                  href='/subscription'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Helvetica,Arial,Tahoma',
                    background: 'linear-gradient(45deg,#4e3c8e 50%,#00FFDE 110%)',
                    width: 150,
                    height: 50,
                    borderRadius: 100,
                    border: '1px solid #00FFDE ',
                    textDecoration: 'none',
                    textShadow: '2xp 2px 2px #00FFDE',
                    fontSize: '1rem',
                  }}
                >
                  <HowToRegIcon />
                  inscripción
                </a>
                <Chip
                  avatar={<EmailIcon />}
                  label='¿soporte?'
                  component='a'
                  href={mailTo}
                  color='default'
                  size='medium'
                  clickable
                />
              </Typography>
              <Typography variant='caption' color='initial'>
                {' '}
                CCN
                <img className='button' src={popipo} alt='logo taller' width={20} />
                app &trade;
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
