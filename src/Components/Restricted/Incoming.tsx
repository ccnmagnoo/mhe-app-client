import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IClassroom, iClassroomConverter } from '../../Models/Classroom.interface';
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
        //fetch
        const rightNow = new Date();
        const ref = db
          .collection(`${dbKey.act}/${refUuid}/${dbKey.room}`)
          .where('dateInstance', '>=', rightNow)
          .withConverter(iClassroomConverter);

        const querySnapshot = await ref.get();
        //snapshot
        const rooms = querySnapshot.docs
          .map((query) => {
            return query.data();
          })
          .sort((a, b) => (a.placeActivity.date > b.placeActivity.date ? 1 : -1));

        console.log('amount next rooms idcal', rooms);
      } catch (error) {
        console.log('amount next rooms', error);
      }
    };

    fetch();
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
