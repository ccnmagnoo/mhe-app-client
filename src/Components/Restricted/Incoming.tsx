import { Divider, Grid } from '@material-ui/core';
import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { RoomAccordion } from './Adapter/RoomView';

//icons
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Context } from './Context/context';

const Incoming = (props: any) => {
  //router dom
  let { path, url } = useRouteMatch();
  console.log('router', path, url);

  //context provider data
  const context = React.useContext(Context);
  const incomingRooms = context.rooms.filter((room) => {
    return room.placeActivity.date > new Date();
  });

  //fetch next incoming classrooms with basic info 🔥🔥🔥
  React.useEffect(() => {
    //firebase fetch roomsWithVacancies
    //fetchRooms();
  }, []);

  const header = (
    <React.Fragment>
      <Typography variant='subtitle1' color='primary'>
        Próximas actividades <DateRangeIcon fontSize='small' /> {incomingRooms.length}
      </Typography>
      <Divider />
      <br />
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
          {header}
          <Grid container spacing={1}>
            {incomingRooms.map((room, index) => {
              return (
                <Grid item key={index} sm={12} xs={12}>
                  {/*roomSingleAccordion(room)*/}
                  <RoomAccordion
                    workDone={false}
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

export default withRouter(Incoming);
