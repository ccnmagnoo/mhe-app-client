import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';

import { NavLink } from 'react-router-dom';

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
        <Button component={NavLink} to='/suscription'>
          Incribete
        </Button>
        <Button component={NavLink} to='/validation'>
          Valida
        </Button>
        {/*<Button component={NavLink} to='/help'>
          Consultas
        </Button>*/}
        <Button component={NavLink} to='/login'>
          Admin
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
};
