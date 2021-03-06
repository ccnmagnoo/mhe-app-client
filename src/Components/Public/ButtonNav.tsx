import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';

//icons
import FaceIcon from '@material-ui/icons/Face';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LockIcon from '@material-ui/icons/Lock';

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
        <Button component={NavLink} to='/suscription' startIcon={<FaceIcon />}>
          Incribete
        </Button>
        <Button component={NavLink} to='/validation' startIcon={<VerifiedUserIcon />}>
          Valida
        </Button>
        {/*<Button component={NavLink} to='/help'>
          Consultas
        </Button>*/}
        <Button component={NavLink} to='/login' startIcon={<LockIcon />}>
          Admin
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
};
