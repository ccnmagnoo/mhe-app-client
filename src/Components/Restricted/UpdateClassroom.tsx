import { Paper, Grid } from '@material-ui/core';
import { useParams, withRouter } from 'react-router-dom';

const UpdateClassroom = (props: any) => {
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
          Update classroom <br />
          {uuid}
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(UpdateClassroom);
