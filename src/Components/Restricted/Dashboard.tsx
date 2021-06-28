import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link, Route, Switch, withRouter, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ClassroomCreate } from './Classroom.Create';
import { Container } from '@material-ui/core';

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
        <ButtonGroup variant='outlined' color='primary' aria-label='dashboad commands'>
          <Button component={Link} to={url}>
            main
          </Button>
          <Button component={Link} to={`${url}/ahead`}>
            futuro
          </Button>
          <Button component={Link} to={`${url}/done`}>
            pasado
          </Button>
          <Button component={Link} to={`${url}/create`}>
            crear
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <Switch>
          <Route exact path={path}>
            Principal : {path}
          </Route>
          <Route path={`${path}/ahead`}>planificación</Route>
          <Route path={`${path}/done`}>realizadas</Route>
          <Route path={`${path}/create`}>
            <ClassroomCreate />
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
};

export default withRouter(Dashboard);
