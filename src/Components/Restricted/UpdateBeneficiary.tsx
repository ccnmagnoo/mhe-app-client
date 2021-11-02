import { Paper, Grid } from '@material-ui/core';
import React from 'react';
import { useParams, withRouter } from 'react-router';

const UpdateBeneficiary = (props: any) => {
  let { uuid } = useParams<{ uuid: string }>();
  return (
    <div>
      <Paper
        elevation={2}
        style={{
          padding: '1rem',
          marginTop: '1rem',
          color: 'gray',
          fontFamily: 'Roboto',
          fontSize: '0.9rem',
        }}
      >
        <Grid container spacing={2}>
          UpdateBeneficiary <br />
          {uuid}
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(UpdateBeneficiary);
