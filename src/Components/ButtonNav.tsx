import { Button, ButtonGroup, Box } from '@material-ui/core';
import React from 'react';

import { Link } from 'react-router-dom';

export const ButtonNav = () => {
  return (
    <React.Fragment>
      <Box alignContent>
        <ButtonGroup
          variant='contained'
          color='primary'
          aria-label='navegación'
          fullWidth
          size='large'
        >
          <Button>Incribete</Button>
          <Button>Valida</Button>
          <Button>Ayuda</Button>
          <Button component={Link} to='/login'>
            Admin
          </Button>
        </ButtonGroup>
      </Box>
    </React.Fragment>
  );
};
