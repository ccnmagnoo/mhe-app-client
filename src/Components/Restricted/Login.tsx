import { Card, Typography, TextField, Grid } from '@material-ui/core';
import React from 'react';

export const Login = () => {
  return (
    <React.Fragment>
      <Card>
        <Grid
          container
          spacing={1}
          direction='column'
          justify='center'
          alignItems='center'
          alignContent='center'
          wrap='nowrap'
        >
          <Grid item>
            <Typography variant='h5' color='primary'>
              Administrador
            </Typography>
          </Grid>

          <Grid item>
            <TextField id='email' type='email' label='email' variant='filled' />
          </Grid>
          <Grid item>
            <TextField id='password' type='password' label='password' variant='filled' />
          </Grid>
        </Grid>
        <br />
        <br />
      </Card>
    </React.Fragment>
  );
};
