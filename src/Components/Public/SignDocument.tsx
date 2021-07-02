import { Paper, Box } from '@material-ui/core';
import React from 'react';

export const SignDocument = (props: { [key: string]: any }) => {
  return (
    <React.Fragment>
      <Paper>
        <Box p={1}>Formulario a firmar</Box>
      </Paper>
    </React.Fragment>
  );
};
