import React from 'react';
import { Welcome } from './Components/Public/Welcome';
import { Container, Typography } from '@material-ui/core';
import { Logo } from './Components/Public/Logo';
import { ButtonNav } from './Components/Public/ButtonNav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Components/Restricted/Login';
import Dashboard from './Components/Restricted/Dashboard';
import { auth } from './Config/firebase';
import firebase from 'firebase/app';
import { Suscription } from './Components/Public/Suscription';
import { Validation } from './Components/Public/Validation';

function App() {
  //auth user firebase
  const [firebaseUser, setFirebaseUser] = React.useState<firebase.User | null | boolean>(
    null
  );

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log('current user', user);
      if (user) {
        setFirebaseUser(user);
        //set user if true, and set FALSE if not😮😮
      } else {
        //present null on problems of conection 🧠❔
        setFirebaseUser(null);
      }
    });
  }, []);

  const landingPage = (
    <Router>
      <br />
      <Container maxWidth='sm'>
        <Logo size={200} name={'Con Buena Energía'} />
        <br />
        <ButtonNav />
        <br />
        <br />
        <Switch>
          <Route path='/suscription'>
            <Suscription />
          </Route>
          <Route path='/validation'>
            <Validation />
          </Route>
          <Route path='/help'>Q&A page</Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/' exact>
            <Welcome />
          </Route>
        </Switch>
      </Container>
    </Router>
  );

  return firebaseUser !== false ? (
    <div className='App'>{landingPage}</div>
  ) : (
    <div>
      <Typography variant='subtitle2' color='initial'>
        cargando usuario
      </Typography>
    </div>
  );
}

export default App;
