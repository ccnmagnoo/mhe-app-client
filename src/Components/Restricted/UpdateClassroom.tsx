import { Paper, Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useParams, withRouter } from 'react-router-dom';

const UpdateClassroom = (props: any) => {
  let { uuid } = useParams<{ uuid: string }>();

  const notFoundBanner = (
    <>
      <Alert severity='error'>elemento no encontrado!</Alert>
    </>
  );

  return (
    <>
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
          Update classroom <br />
          {uuid} <br />
          {notFoundBanner}
        </Grid>
      </Paper>
    </>
  );
};

export default withRouter(UpdateClassroom);
