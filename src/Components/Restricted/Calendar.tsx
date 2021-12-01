import moment from 'moment';
import { IClassroom } from '../../Models/Classroom.interface';
import { IPlace } from '../../Models/Place.interface';
import './calendar.css';
import CalendarPopUp from './Calendar.Popup';

export interface IEvent {
  idCal: string | undefined;
  info: IPlace | undefined;
  variant: 'activity' | 'delivery';
  colaborator: string;
  suscribed?: number;
  benefited?: number;
}

const Calendar = (props: { rooms?: IClassroom[] }) => {
  //calendar init params
  const today = new Date();
  //since when is shown the weeks
  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  //since when event data collecting is fetched
  const startDateCollecting = new Date();
  startDateCollecting.setDate(today.getDate() - 28); /*data colected 28 ago*/
  startDateCollecting.setHours(0, 0, 0, 0);

  //events list
  const eventList: IEvent[] = [];
  //data loading
  props.rooms
    ?.filter((it) => it.dateInstance >= startDateCollecting)
    .forEach((it) => {
      const activity: IEvent = {
        idCal: it.idCal,
        info: it.placeActivity,
        variant: 'activity',
        colaborator: it.colaborator,
        suscribed: it.enrolled.length,
        benefited: it.attendees.length,
      };
      const delivery: IEvent = {
        idCal: it.idCal,
        info: it.placeDispatch,
        variant: 'delivery',
        colaborator: it.colaborator,
        suscribed: it.enrolled.length,
        benefited: it.attendees.length,
      };
      eventList.push(...[activity, delivery]);
    });

  //day headers
  const dayHeader = ['L', 'M', 'M', 'J', 'V'].map((d, i) => (
    <li key={i} className='myCalendar header'>
      {d}
    </li>
  ));

  //days sequence
  const listDays: JSX.Element[] = [];
  for (let index = 0; index < 28; index++) {
    //set day container
    const dayOfMonth = new Date(weekStart);
    dayOfMonth.setDate(dayOfMonth.getDate() + index);

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

const EventContainer = (props: { dateSet: Date; events?: IEvent[] }) => {
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
        {events
          ?.sort((a, b) => (a.info?.date! > b.info?.date! ? 1 : -1))
          .map((event, index) => {
            return (
              <CalendarPopUp event={event} index={index} key={index}></CalendarPopUp>
            );
          })}
      </div>
    </li>
  );
};

export default Calendar;
