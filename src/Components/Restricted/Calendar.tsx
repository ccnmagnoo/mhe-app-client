import moment from 'moment';

import { IClassroom } from '../../Models/Classroom.interface';
import { IPlace } from '../../Models/Place.interface';
import './calendar.css';

interface Event {
  idCal: string | undefined;
  info: IPlace | undefined;
  variant: 'activity' | 'delivery';
  colaborator: string;
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
        colaborator: it.colaborator,
      };
      const delivery: Event = {
        idCal: it.idCal,
        info: it.placeDispatch,
        variant: 'delivery',
        colaborator: it.colaborator,
      };
      eventList.push(...[activity, delivery]);
    });

  console.log('calendar', eventList.length);
  //day headers
  const dayHeader = ['L', 'M', 'M', 'J', 'V'].map((d, i) => (
    <li key={i} className='myCalendar header'>
      {d}
    </li>
  ));

  //days sequence
  const listDays: JSX.Element[] = [];
  for (let index = 0; index < 21; index++) {
    //set day container
    const dayOfMonth = new Date();
    dayOfMonth.setDate(weekStart.getDate() + index);

    //if Sun or Sat
    if (dayOfMonth.getDay() === 0 || dayOfMonth.getDay() === 6) continue;

    //filter events for @dayOfMonth
    const eventListByDay = eventList.filter((it) => {
      return dayOfMonth.toLocaleDateString() === it.info?.date.toLocaleDateString();
    });

    //array of day containers
    listDays.push(<EventContainer dateSet={dayOfMonth} events={eventListByDay} />);
  }

  return (
    <div className='myCalendar'>
      <div className='myCalendar container'>
        <h4 className='myCalendar'>Plan próximas semanas</h4>
        <p className='myCalendar'>{moment(weekStart).format(' dddd DD MMM YYYY')}</p>
        <ol className='myCalendar'>
          {/*days header 😀*/}
          {dayHeader}
          {/* day sequence 🅰️*/}
          {listDays}
        </ol>
      </div>
    </div>
  );
};

const EventContainer = (props: { dateSet: Date; events?: Event[] }) => {
  const { dateSet, events } = props;

  return (
    <li
      className={
        dateSet.toLocaleDateString() === new Date().toLocaleDateString()
          ? 'myCalendar today'
          : 'myCalendar sequence'
      }
      key={dateSet.getTime()}
    >
      {/*header*/}
      <div>{moment(dateSet).format('DD MMM')}</div>
      <div>
        {events?.map((event) => {
          return (
            <div className='eventWidget'>
              {/*widget🔳*/}
              {event.idCal}
              <span className={`myCalendar ${event.variant}`}>
                {event.variant === 'delivery' ? 'entrega' : 'taller'}
              </span>
              {/*popUp📲*/}

              <span className='myCalendar popUp'>{event.colaborator}</span>
            </div>
          );
        })}
      </div>
    </li>
  );
};

export default Calendar;
