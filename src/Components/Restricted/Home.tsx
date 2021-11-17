import { Button, Typography, Grid } from '@material-ui/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, Route, Switch, withRouter, useRouteMatch } from 'react-router-dom';
import React from 'react';
import Calendar from './Calendar';

const Home = (props: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { path, url } = useRouteMatch();

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='subtitle2' color='primary'>
            Plan 4 semanas
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Calendar />
        </Grid>
      </Grid>

      <Typography variant='body2' color='primary'>
        <Button component={Link} to={`${url}/edituser/rvflslkjdf`}>
          Editar usuario (desarrollo)
        </Button>
        <br />
        <Button component={Link} to={`${url}/editroom/rvflslkjdf`}>
          Editar taller (desarrollo)
        </Button>
      </Typography>
    </div>
  );
};

export default withRouter(Home);
