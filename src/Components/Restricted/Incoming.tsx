import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IClassroom } from '../../Models/Classroom.interface';
import { dbKey } from '../../Models/databaseKeys';

const Incoming = (props: any) => {
  //router dom
  let { path, url } = useRouteMatch();

  //content data
  const [incoming, setIncoming] = React.useState<IClassroom[]>([]); /*rext activities*/
  React.useEffect(() => {
    //fetch next incoming classrooms with basic info 🔥🔥🔥
    const fetch = async () => {
      try {
        const ref = db.collection(`${dbKey.act}/${refUuid}/${dbKey.room}`);
        const snapshot = await ref.get();
        console.log('amount next rooms', snapshot.docs.length);
      } catch (error) {
        console.log('amount next rooms', error);
      }
    };
  }, []);

  const head = (
    <React.Fragment>
      <Typography variant='subtitle1' color='primary'>
        Próximas actividades
      </Typography>
    </React.Fragment>
  );

  const incomingRooms = <React.Fragment></React.Fragment>;

  return (
    <React.Fragment>
      <Paper>
        <Box p={1}>{head}</Box>
      </Paper>
    </React.Fragment>
  );
};

export default withRouter(Incoming);
