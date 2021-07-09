import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Chip,
  Grid,
} from '@material-ui/core';
import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IClassroom, iClassroomConverter } from '../../Models/Classroom.interface';
import { dbKey } from '../../Models/databaseKeys';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';

const Incoming = (props: any) => {
  //router dom
  let { path, url } = useRouteMatch();

  //content data
  const [incoming, setIncoming] = React.useState<IClassroom[]>([]); /*rext activities*/

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
        .where('dateInstance', '>=', rightNow)
        .withConverter(iClassroomConverter);

      const snapshot = await ref.get();

      const rooms = snapshot.docs
        .map((query) => {
          return query.data();
        })
        .sort((a, b) => (a.placeActivity.date > b.placeActivity.date ? 1 : -1));

      console.log(
        'amount next rooms idcal',
        rooms.map((it) => it.idCal)
      );

      //set state
      setIncoming(rooms);
    } catch (error) {
      console.log('amount next rooms idcal', error);
    }
  };

  const head = (
    <React.Fragment>
      <Typography variant='subtitle1' color='primary'>
        Próximas actividades
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
  ////accordion view 👓

  const roomSingleAccordion = (room: IClassroom) => {
    return (
      <>
        <Accordion
          expanded={expanded === room.idCal}
          onChange={handleAccordionChange(room.idCal)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
          >
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={3}>
                <Chip
                  avatar={<Avatar>R</Avatar>}
                  label={room.idCal.slice(1)}
                  color='secondary'
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant='caption' color='initial'>
                  {moment(room.placeActivity.date).format('DD [de] MMMM YY h:mm a')}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>room content</Typography>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  return (
    <React.Fragment>
      <Paper>
        <Box p={1}>
          {head}
          <Grid container spacing={1}>
            {incoming.map((room, index) => {
              return (
                <Grid item key={index} sm={12} xs={12}>
                  {roomSingleAccordion(room)}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default withRouter(Incoming);
