import {
  Accordion,
  AccordionSummary,
  Grid,
  Chip,
  Avatar,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { IClassroom } from '../../../Models/Classroom.interface';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const RoomAccordion = (props: {
  room: IClassroom;
  expanded: string | boolean;
  handleAccordionChange: (
    panel: string
  ) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}) => {
  const room = props.room;
  const expanded = props.expanded;
  const handleAccordionChange = props.handleAccordionChange;

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
