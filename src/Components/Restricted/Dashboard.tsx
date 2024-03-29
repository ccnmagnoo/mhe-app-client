import React, { lazy, Suspense } from 'react';
import { Link, Route, Switch, withRouter, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { Edit as Edition } from './Edition';
import './Dashboard.css';

//componentes
import { PeriodSelector } from './Dashboard.PeriodSelector';
import Home from './Home';
import Create from './Create';
//import Incoming from './Incoming';
//import Outgoing from './Outgoing';
import Provider from './Context/context';
import UpdateBeneficiary from './UpdateBeneficiary';
import UpdateClassroom from './UpdateClassroom';

//icons
import PostAddIcon from '@material-ui/icons/PostAdd';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import { User } from 'firebase/auth';
import { auth } from '../../Config/firebase';
import Subscription from '../Public/Subscription';
// import { Operations } from './Operations';
//lazy loading
const Incoming = lazy(() => import('./Incoming'));
const Outgoing = lazy(() => import('./Outgoing'));

const Dashboard = (props: any) => {
  //nested routing
  let { path, url } = useRouteMatch();
  //
  const [admin, setAdmin] = React.useState<User | null>(null);

  //protected routing
  React.useEffect(() => {
    if (auth.currentUser) {
      console.log('admin is logged?', true);
      setAdmin(auth.currentUser);
    } else {
      //kick out to login retrited place
      console.log('admin is logged?', false);
      props.history.push('/login');
    }
  }, [props.history]);

  const closeAdmin = () => {
    auth.signOut().then(() => {
      console.log('admin is loggin out', false);
      props.history.push('/login');
    });
  };

  return (
    <Provider>
      {/*useContextProvider*/}
      <Grid
        container
        spacing={1}
        direction='row'
        justify='center'
        alignItems='center'
        alignContent='center'
      >
        <Grid item xs={12}>
          <ButtonGroup
            id='private-navigation'
            variant='outlined'
            color='primary'
            aria-label='dashboad commands'
            fullWidth
          >
            <Button component={Link} to={url}>
              <HomeIcon />
            </Button>
            <Button component={Link} to={`${url}/outgoing`}>
              <EventAvailableIcon />
              <span>pasadas</span>
            </Button>
            <Button component={Link} to={`${url}/incoming`}>
              <DateRangeIcon titleAccess='Próximas actividades' /> <span>próximas</span>
            </Button>
            <Button component={Link} to={`${url}/addperson`}>
              <PersonAddIcon />
              <span>usuario</span>
            </Button>
            <Button component={Link} to={`${url}/create`}>
              <PostAddIcon />
              <span>taller</span>
            </Button>
            <Button onClick={closeAdmin}>
              <ExitToAppIcon />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <PeriodSelector />
        </Grid>
        <Grid item xs={12}>
          <Switch>
            <Route exact path={path}>
              <Typography variant='caption' color='initial'>
                Bienvenido {admin?.email}
              </Typography>
              {/*main*/}
              <Home />
            </Route>
            <Route path={`${path}/incoming`}>
              <Suspense
                fallback={
                  <Typography variant='caption' color='initial'>
                    loading...
                  </Typography>
                }
              >
                <Incoming />
              </Suspense>
            </Route>
            <Route path={`${path}/outgoing`}>
              <Suspense
                fallback={
                  <Typography variant='caption' color='initial'>
                    loading...
                  </Typography>
                }
              >
                <Outgoing />
              </Suspense>
            </Route>
            <Route path={`${path}/addperson`}>
              {/*create new unsubscribed person after period gap*/}

              <Subscription overSubscription={true} />
            </Route>
            <Route path={`${path}/create`}>
              {/*create new classroom*/}
              <Create />
            </Route>
            <Route path={`${path}/edition`}>
              <Edition />
            </Route>

            <Route path={`${path}/edituser/:uuid`} children={<UpdateBeneficiary />} />

            <Route path={`${path}/editroom/:uuid`} children={<UpdateClassroom />} />

            {/* <Route path={`${path}/operations`} children={<Operations />} /> */}
          </Switch>
        </Grid>
      </Grid>
    </Provider>
  );
};

export default withRouter(Dashboard);
