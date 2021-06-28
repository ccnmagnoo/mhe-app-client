import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';

import { Link } from 'react-router-dom';

export const ButtonNav = () => {
  return (
    <React.Fragment>
      <ButtonGroup
        variant='contained'
        color='primary'
        aria-label='navegación'
        fullWidth
        size='large'
      >
        <Button component={Link} to='/suscription'>
          Incribete
        </Button>
        <Button component={Link} to='/validation'>
          Valida
        </Button>
        <Button component={Link} to='/help'>
          Consultas
        </Button>
        <Button component={Link} to='/login'>
          Admin
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
};
