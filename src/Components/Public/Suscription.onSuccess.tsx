import { Card, CardContent, Paper } from '@material-ui/core';
import { Box, Grid, Typography, Avatar, CardHeader, IconButton } from '@material-ui/core';
import React from 'react';
import { IClassroom } from '../../Models/Classroom.interface';
import { IPerson } from '../../Models/Person.Interface';
import moment from 'moment';
import 'moment/locale/es'; // Pasar a español

//icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { isUrl } from '../../Functions/IsURL';
import { Alert } from '@material-ui/lab';

type SuccessProps = {
  classroom?: IClassroom;
  person?: IPerson;
};

export const OnSuccessSuscription = (props: SuccessProps) => {
  //referencias
  const person = props.person;
  const classroom = props.classroom;

  const getUrl = (chain?: string) => {
    //check definition
    if (chain === undefined) return undefined;
    //check if dir is url or physical
    const gmaps = 'https://www.google.com/maps?q=';
    if (isUrl(chain)) {
      return <a href={chain}> {chain}</a>;
    } else {
      return <a href={`${gmaps}${chain.replace(' ', '+')}`}>{chain}</a>;
    }
  };

  return (
    <React.Fragment>
      <Paper elevation={0}>
        <Box p={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body1' color='textPrimary'>
                no te olvides de participar, y anota los siguientes datos
                <br />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box p={1}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar aria-label='id'>{classroom?.idCal.replace('R', '')}</Avatar>
                    }
                    action={
                      <IconButton aria-label=''>
                        <CheckCircleIcon color='primary' />
                      </IconButton>
                    }
                    title={`Colaboración ${classroom?.colaborator}`}
                    subheader={moment(classroom?.dateInstance).format(
                      'dddd DD MMMM YYYY [a las] h:mm a'
                    )}
                  />
                  <CardContent>
                    <Typography variant='caption' color='primary'>
                      no olvides que es{' '}
                      <strong>
                        {moment(classroom?.dateInstance).endOf('days').fromNow()}
                      </strong>
                    </Typography>
                    <Typography variant='body1' color='textPrimary'>
                      el taller de capacitación de realizará en{' '}
                      {classroom?.placeActivity.name} con la siguiente dirección <br />
                      {}
                      {getUrl(classroom?.placeActivity.dir)}
                    </Typography>
                    {/*snack bar warning 💥*/}
                    <Alert severity='error'>
                      <Typography variant='body1' color='textSecondary'>
                        Su Kit de Ahorro <strong>se entregará</strong> a partir del <br />
                        {moment(classroom?.placeDispatch?.date).format(
                          'DD [de] MMMM [a partir las] h:mm a'
                        )}{' '}
                        en la siguiente dirección <br />
                        <strong> {classroom?.placeDispatch?.name}</strong> <br />
                        {getUrl(classroom?.placeDispatch?.dir)}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};
