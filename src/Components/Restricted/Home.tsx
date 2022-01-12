import { Button, Typography, Grid } from '@material-ui/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, Route, Switch, withRouter, useRouteMatch } from 'react-router-dom';
import React from 'react';
import Calendar from './Calendar';
import { Context } from './Context/context';

const Home = (props: any) => {
  let { url } = useRouteMatch();
  const context = React.useContext(Context);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Calendar rooms={context.rooms} />
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
        <br />
        <Button component={Link} to={`${url}/operations`}>
          op
        </Button>
      </Typography>
    </div>
  );
};

export default withRouter(Home);
