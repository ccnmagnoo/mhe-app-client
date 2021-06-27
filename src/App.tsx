import React from 'react';
import { Welcome } from './Components/Welcome';
import { Container } from '@material-ui/core';
import { Logo } from './Components/Logo';
import { ButtonNav } from './Components/ButtonNav';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Login } from './Components/Restricted/Login';

function App() {
  const [use, setUse] = React.useState(0);
  return (
    <div className='App'>
      <Router>
        <Container maxWidth='xs'>
          <Logo size={200} name={'Con Buena Energía'} />
          <br />
          <ButtonNav />
          <br />
          <Switch>
            <Route path='/login' exact>
              <Login />
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
