import React from 'react';
import { Link, Route, Switch, withRouter, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Create } from './Create';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import { Edit as Edition } from './Edition';

const Dashboard = (props: any) => {
  //nested routing
  let { path, url } = useRouteMatch();

  return (
    <Grid
      container
      spacing={1}
      direction='column'
      justify='center'
      alignItems='center'
      alignContent='center'
      wrap='wrap'
    >
      <Grid item>
        <ButtonGroup
          variant='outlined'
          color='primary'
          aria-label='dashboad commands'
          fullWidth
        >
          <Button component={Link} to={url}>
            <HomeIcon />
          </Button>
          <Button component={Link} to={`${url}/ahead`}>
            futuro
          </Button>
          <Button component={Link} to={`${url}/done`}>
            pasado
          </Button>
          <Button component={Link} to={`${url}/create`}>
            <AddCircleOutlineIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <Switch>
          <Route exact path={path}>
            Principal
          </Route>
          <Route path={`${path}/ahead`}>planificación</Route>
          <Route path={`${path}/done`}>realizadas</Route>
          <Route path={`${path}/create`}>
            <Create />
          </Route>
          <Route path={`${path}/edition`}>
            <Edition />
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
};

export default withRouter(Dashboard);
