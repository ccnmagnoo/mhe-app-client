import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';

//icons
import FaceIcon from '@material-ui/icons/Face';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LockIcon from '@material-ui/icons/Lock';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import './ButtonNav.css';

import { NavLink } from 'react-router-dom';

export const ButtonNav = () => {
  return (
    <section id='main-navigation'>
      <ButtonGroup
        variant='contained'
        color='primary'
        aria-label='navegación'
        fullWidth
        size='medium'
      >
        <Button component={NavLink} to='/suscription' startIcon={<FaceIcon />}>
          <span>Inscribete</span>
        </Button>
        <Button component={NavLink} to='/validation' startIcon={<VerifiedUserIcon />}>
          <span>Valida</span>
        </Button>

        <Button component={NavLink} to='/resources' startIcon={<PlayCircleOutlineIcon />}>
          <span>Aprende</span>
        </Button>

        <Button component={NavLink} to='/login' startIcon={<LockIcon />}>
          <span>Admin</span>
        </Button>
      </ButtonGroup>
    </section>
  );
};
