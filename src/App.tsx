import React, { lazy, Suspense } from 'react';
import { Welcome } from './Components/Public/Welcome';
import { Container, Typography } from '@material-ui/core';
import { Logo } from './Components/Public/Logo';
import { ButtonNav } from './Components/Public/ButtonNav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Components/Restricted/Login';
import Dashboard from './Components/Restricted/Dashboard';
import { auth } from './Config/firebase';
import Subscription from './Components/Public/Subscription';
import Validation from './Components/Public/Validation';
import { Help } from './Components/Public/Help';
import { User } from 'firebase/auth';
import './App.css';
//import { EducationalResources } from './Components/Public/EducationalResources';
const EducationalResources = lazy(
  () => import('./Components/Public/EducationalResources')
);

function App() {
  //auth user firebase
  const [firebaseUser, setFirebaseUser] = React.useState<User | null | boolean>(null);

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log('current user', user);
      if (user) {
        setFirebaseUser(user);
        //set user if true, and set FALSE if not😮😮
      } else {
        //present null on problems of confection 🧠❔
        setFirebaseUser(null);
      }
    });
  }, []);

  const landingPage = (
    <Router>
      <Container maxWidth='sm'>
        <Logo size={200} name={'Con Buena Energía'} />

        {/* navigation 🟦🟦🟦🟦*/}
        <ButtonNav />

        {/* viewport s */}
        <div style={{ padding: '10px 0' }}>
          <Switch>
            <Route path='/subscription'>
              <Subscription />
            </Route>
            <Route path='/validation'>
              <Validation />
            </Route>
            <Route path='/help'>
              <Help />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/resources'>
              <Suspense
                fallback={
                  <Typography variant='caption' color='initial'>
                    loading...
                  </Typography>
                }
              >
                <EducationalResources />
              </Suspense>
            </Route>
            <Route path='/dashboard'>
              <Dashboard />
            </Route>
            <Route path='/' exact>
              <Welcome />
            </Route>
          </Switch>
        </div>
      </Container>
    </Router>
  );

  return firebaseUser !== false ? (
    <>
      <div className='background'></div>
      <div className='App-container'>
        <div className='App'>{landingPage}</div>
      </div>
    </>
  ) : (
    <div>
      <Typography variant='subtitle2' color='initial'>
        cargando usuario
      </Typography>
    </div>
  );
}

export default App;
