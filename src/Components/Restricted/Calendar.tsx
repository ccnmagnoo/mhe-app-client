import { Paper } from '@material-ui/core';
import React from 'react';
import { IClassroom } from '../../Models/Classroom.interface';

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

const Calendar = (props: { rooms?: IClassroom[] }) => {
  return <Paper variant='outlined'></Paper>;
};

export default Calendar;
