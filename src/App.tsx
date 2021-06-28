import React from 'react';
import { Welcome } from './Components/Public/Welcome';
import { Container } from '@material-ui/core';
import { Logo } from './Components/Public/Logo';
import { ButtonNav } from './Components/Public/ButtonNav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Components/Restricted/Login';
import Dashboard from './Components/Restricted/Dashboard';

function App() {
  return (
    <div className='App'>
      <Router>
        <br />
        <Container maxWidth='sm'>
          <Logo size={200} name={'Con Buena Energía'} />
          <br />
          <ButtonNav />
          <br />
          <Switch>
            <Route path='/suscription'>suscription page</Route>
            <Route path='/validation'>validation page</Route>
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
    </div>
  );
}

export default App;
