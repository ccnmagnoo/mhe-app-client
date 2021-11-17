import { Paper } from '@material-ui/core';

import { IClassroom } from '../../Models/Classroom.interface';
import './calendar.css';

const Calendar = (props: { rooms?: IClassroom[] }) => {
  //calendar init params
  const today = new Date();
  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  //day headers
  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
    <li key={i} className='header'>
      {d}
    </li>
  ));

  //days sequence
  const listDays: JSX.Element[] = [];
  for (let index = 0; index < 14; index++) {
    const dayOfMonth = new Date();
    dayOfMonth.setDate(weekStart.getDate() + index);
    listDays.push(
      <li className='sequence' key={dayOfMonth.getTime()}>
        {dayOfMonth.getDate()}
      </li>
    );
  }

  return (
    <Paper variant='outlined'>
      <div className='myCalendar'>
        <h4>Plan semanal</h4>
        <p>{weekStart.toDateString()}</p>
        <ol>
          {/*days header 😀*/}
          {dayNames}
          {/* day sequence 🅰️*/}
          {listDays}
        </ol>
      </div>
    </Paper>
  );
};

export default Calendar;
