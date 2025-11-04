import { Grid } from '@material-ui/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, Route, Switch, withRouter, useRouteMatch } from 'react-router-dom';
import React from 'react';
import Calendar from './Calendar/Calendar';
import { Context } from './Context/context';
import SocialProgram, { socialContext } from '../../Models/Program';

const Home = (props: any) => {
  const context = React.useContext(Context);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Calendar rooms={context.rooms} />
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Home);
