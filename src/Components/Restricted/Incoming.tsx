import { Divider, Grid } from '@material-ui/core';
import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import RoomView from './Adapter/RoomView';

//icons
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Context } from './Context/context';

const Incoming = (props: any) => {
  //router dom
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { path, url } = useRouteMatch();

  //context provider data
  const context = React.useContext(Context);
  const incoming = context.rooms
    .filter((room) => {
      return room.placeActivity.date >= new Date();
    })
    .reverse();

  const header = (
    <React.Fragment>
      <Typography variant='subtitle1' color='primary'>
        Próximos talleres temporada {context.period} <DateRangeIcon fontSize='small' />{' '}
        {incoming.length}
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
    <>
      <Paper>
        <Box p={1}>
          {header}
          <Grid container spacing={1}>
            {incoming.map((room, index) => {
              return (
                <Grid item key={index} sm={12} xs={12}>
                  {/*roomSingleAccordion(room)*/}
                  <RoomView
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
    </>
  );
};

export default withRouter(Incoming);
