import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ClassroomCreate } from './Classroom.Create';
import { Container } from '@material-ui/core';

const Dashboard = (props: any) => {
  return (
    <Container maxWidth='sm'>
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
            <Button>dashboard</Button>
            <Button>+actividad</Button>
            <Button>+edit</Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <ClassroomCreate />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withRouter(Dashboard);
