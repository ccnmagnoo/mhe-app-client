import { Paper } from '@material-ui/core';

import { IClassroom } from '../../Models/Classroom.interface';
import { IPlace } from '../../Models/Place.interface';
import './calendar.css';

interface Event {
  idCal: string | undefined;
  info: IPlace | undefined;
  variant: 'activity' | 'delivery';
}

const Calendar = (props: { rooms?: IClassroom[] }) => {
  //calendar init params
  const today = new Date();
  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  //events list
  const eventList: Event[] = [];
  //data loading
  props.rooms
    ?.filter((it) => it.dateInstance >= weekStart)
    .forEach((it) => {
      const activity: Event = {
        idCal: it.idCal,
        info: it.placeActivity,
        variant: 'activity',
      };
      const delivery: Event = {
        idCal: it.idCal,
        info: it.placeDispatch,
        variant: 'delivery',
      };
      eventList.push(...[activity, delivery]);
      console.log('calendar', eventList.length);
    });

  //day headers
  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
    <li key={i} className='header'>
      {d}
    </li>
  ));

  //days sequence
  const listDays: JSX.Element[] = [];
  for (let index = 0; index < 28; index++) {
    //set day container
    const dayOfMonth = new Date();
    dayOfMonth.setDate(weekStart.getDate() + index);
    //filter events for @dayOfMonth
    const eventListDay = eventList.filter((it) => {
      return dayOfMonth.toLocaleDateString() === it.info?.date.toLocaleDateString();
    });

    //array of day containers
    listDays.push(
      <li className='sequence' key={dayOfMonth.getTime()}>
        <EventContainer dateSet={dayOfMonth} events={eventListDay} />
      </li>
    );
  }

  return (
    <Paper variant='outlined'>
      <div className='myCalendar'>
        <h4>Plan próximas semanas</h4>
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

const EventContainer = (props: { dateSet: Date; events?: Event[] }) => {
  return (
    <>
      {props.dateSet.getDate()} <br />
      {props.events?.length === 0 ? '' : '⭐' + props.events?.length}
    </>
  );
};

export default Calendar;
