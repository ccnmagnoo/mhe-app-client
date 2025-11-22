import { Card, CardContent, Paper } from '@material-ui/core';
import { Box, Grid, Typography, Avatar, CardHeader, IconButton } from '@material-ui/core';
import React from 'react';
import { IRoom } from '../../../Models/Classroom.interface';
import { IPerson } from '../../../Models/Person.Interface';
import moment from 'moment';
import 'moment/locale/es'; // Pasar a español
import './Subscription.css';
import QRCode from 'react-qr-code';

//icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { isUrl } from '../../../Functions/IsURL';
import { Alert } from '@material-ui/lab';
import convertToUrl from '../../../Functions/contertToUrl';

type SuccessProps = {
  classroom?: IRoom;
  person?: Partial<IPerson>;
};

export const OnSuccessSubscription = (props: SuccessProps) => {
  //referencias
  const { classroom, person } = props;

  //converter Url

  return (
    <React.Fragment>
      <Paper elevation={0}>
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box p={1}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar aria-label='id' style={{ fontSize: '1rem' }}>
                        {classroom?.idCal.replace('R', '').split('.')[0]}
                      </Avatar>
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
                  ></CardHeader>

                  <CardContent>
                    <Typography variant='caption' color='primary'>
                      no olvides que es{' '}
                      <strong>
                        {moment(classroom?.dateInstance).endOf('days').fromNow()}
                      </strong>
                    </Typography>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      paragraph
                      align='justify'
                      className='subscribed_data'
                    >
                      <h5>Sus datos de registro</h5>
                      <p>
                        {person?.name?.firstName} {person?.name?.fatherName}
                      </p>
                      <p className='rut'>{person?.rut}</p>
                      <div style={{}}>
                        <QRCode
                          size={130}
                          value={person?.uuid || 'no-data'}
                          fgColor='#888'
                        />
                      </div>
                      <p className='uuid'>{person?.uuid}</p>
                    </Typography>
                    {/*snack bar warning 💥*/}
                    <Alert severity='info'>
                      <Typography variant='body1' color='textSecondary'>
                        El taller <strong>se realizará</strong> con fecha <br />
                        {moment(classroom?.placeActivity?.date).format(
                          'DD [de] MMMM [desde las] h:mm a'
                        )}{' '}
                        en la siguiente dirección <br />
                        <strong> {classroom?.placeDispatch?.name}</strong> <br />
                        {convertToUrl(classroom?.placeDispatch?.dir)}
                      </Typography>
                      <Typography variant='caption' color='secondary'>
                        la participación en el taller es
                        <strong> obligatoria</strong> .
                      </Typography>
                    </Alert>
                    <Typography variant='body1' color='textPrimary'>
                      no te olvides de participar.
                      <br />
                    </Typography>
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
