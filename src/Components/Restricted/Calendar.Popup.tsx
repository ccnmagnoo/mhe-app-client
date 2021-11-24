import moment from 'moment';
import React from 'react';
import { UrlChip } from '../Public/UrlChip';
import { IEvent } from './Calendar';

const CalendarPopUp = (props: { event: IEvent; index: number }) => {
  const { event, index } = props;
  const [isActive, setIsActive] = React.useState<boolean>(false);

  function popUpClass() {
    return isActive ? 'myCalendar popUp show' : 'myCalendar popUp';
  }

  function handleOnClick() {
    console.log('popUp calendar', event.idCal, 'show', !isActive);
    setIsActive(!isActive);
  }
  const tag = (
    <span className={`myCalendar tag ${event.variant}`}>
      {event.variant === 'delivery' ? 'entrega' : 'taller'}
    </span>
  );
  return (
    <>
      <div key={index} className='eventWidget ' onClick={handleOnClick}>
        {/*widget🔳*/}
        {event.idCal}
        {/*tag variant*/}
        {tag}
        {/*popUp📲: must be visible on click*/}

        <span className={popUpClass()}>
          <div>
            <div>
              {tag}
              {event.colaborator}
            </div>
            <br />
            <div>
              <UrlChip url={event.info?.dir} textContent='dirección' />{' '}
              {moment(event.info?.date).format('DD/MMM H:mm')}
            </div>
          </div>
        </span>
      </div>
    </>
  );
};

export default CalendarPopUp;
