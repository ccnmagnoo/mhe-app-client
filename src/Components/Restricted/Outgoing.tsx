import { Grid } from '@material-ui/core';
import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IClassroom, iClassroomConverter } from '../../Models/Classroom.interface';
import { dbKey } from '../../Models/databaseKeys';
import { RoomAccordion } from './Adapter/RoomAccordion';

//icons

const Outgoing = (props: any) => {
  //router dom
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { path, url } = useRouteMatch();

  //content data
  const [outgoing, setOutgoing] = React.useState<IClassroom[]>([]); /*rext activities*/

  //fetch next incoming classrooms with basic info 🔥🔥🔥
  React.useEffect(() => {
    //firebase fetch roomsWithVacancies
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      //fetch
      const rightNow = new Date();
      const ref = db
        .collection(`${dbKey.act}/${refUuid}/${dbKey.room}`)
        .where('dateInstance', '<=', rightNow)
        .orderBy('dateInstance', 'desc')
        .limit(10)
        .withConverter(iClassroomConverter);

      const snapshot = await ref.get();

      const rooms = snapshot.docs
        .map((query) => {
          return query.data();
        })
        .sort((a, b) => (a.placeActivity.date > b.placeActivity.date ? -1 : 1));

      console.log(
        'amount next rooms idcal',
        rooms.map((it) => it.idCal)
      );

      //set state
      setOutgoing(rooms);
    } catch (error) {
      console.log('amount next rooms idcal', error);
    }
  };

  const head = (
    <React.Fragment>
      <Typography variant='subtitle1' color='primary'>
        Actividades completadas ✔
      </Typography>
    </React.Fragment>
  );

  //acoordion section
  ////accordion behavior 🎠
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleAccordionChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <React.Fragment>
      <Paper>
        <Box p={1}>
          {head}
          <Grid container spacing={1}>
            {outgoing.map((room, index) => {
              return (
                <Grid item key={index} sm={12} xs={12}>
                  {/*roomSingleAccordion(room)*/}
                  <RoomAccordion
                    workDone={true}
                    room={room}
                    expanded={expanded}
                    handleAccordionChange={handleAccordionChange}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default withRouter(Outgoing);
