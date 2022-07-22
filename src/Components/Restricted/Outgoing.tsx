import { Grid } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import RoomView from './Adapter/RoomView';
import { Context } from './Context/context';

//icons

const Outgoing = (props: any) => {
  //router dom
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { path, url } = useRouteMatch();

  //context provider data
  const context = React.useContext(Context);
  const outgoingRooms = context.rooms.filter((room) => {
    return room.placeActivity.date <= new Date();
  });

  //acoordion section
  ////accordion behavior 🎠
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleAccordionChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  //year statictics
  const [statistics, setStatisctis] = React.useState<{
    quantity: number;
    enrolled: number;
    attendees: number;
  }>({
    quantity: 0,
    enrolled: 0,
    attendees: 0,
  });

  React.useEffect(() => {
    if (outgoingRooms.length !== 0) {
      const result = {
        quantity: outgoingRooms.filter((it) => {
          return it.enrolled.length > 0;
        }).length,
        enrolled: outgoingRooms.map((it) => it.enrolled.length).reduce((a, b) => a + b),
        attendees: outgoingRooms
          .map((it) =>
            it.statistics !== undefined
              ? (it.statistics['M'] ?? 0) + (it.statistics['F'] ?? 0)
              : 0
          )
          .reduce((a, b) => a + b),
      };

      setStatisctis(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.rooms]);

  const header = (
    <React.Fragment>
      <Typography variant='subtitle1' color='primary'>
        Actividades completadas ✔ {statistics.quantity}{' '}
        <Typography variant='subtitle2' color='textSecondary' display='inline'>
          con <strong>{statistics.attendees}</strong> familias{' '}
        </Typography>
      </Typography>
      <Divider />
      <br />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Paper>
        <Box p={1}>
          {header}
          <Grid container spacing={1}>
            {outgoingRooms.map((room, index) => {
              return (
                <Grid item key={index} sm={12} xs={12}>
                  {/*roomSingleAccordion(room)*/}
                  <RoomView
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
