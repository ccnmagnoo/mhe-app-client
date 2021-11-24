import moment from 'moment';
import React from 'react';
import { UrlChip } from '../Public/UrlChip';
import { IEvent } from './Calendar';

const CalendarPopUp = (props: {
  event: IEvent;
  index: number;
  children?: React.ReactNode;
}) => {
  const { event, index } = props;
  const [isActive, setIsActive] = React.useState<boolean>(false);

  /**@function popUpClass show popUp*/
  function popUpClass() {
    return isActive ? 'myCalendar popUp show' : 'myCalendar popUp';
  }
  /**@function onClick*/
  function handleOnClick() {
    console.log('popUp calendar', event.idCal, 'show', !isActive);
    setIsActive(!isActive);
  }

  //sub element tag
  const tag = (
    <span className={`myCalendar tag ${event.variant}`}>
      {event.variant === 'delivery' ? 'entrega' : 'taller'}
    </span>
  );

  const widgetContent = (
    <span className={popUpClass()}>
      <section style={{ display: 'flex' }}>
        <div style={{ padding: '5px', alignContent: 'middle' }}>
          {tag}
          {event.colaborator}
          <br />
          <div style={{ padding: '15px 0px 0px 0px' }}>
            <UrlChip url={event.info?.dir} textContent='dirección' />{' '}
            {moment(event.info?.date).format('DD/MMM H:mm')}
          </div>
        </div>
        <div> ipson lorem</div>
      </section>
    </span>
  );
  return (
    <>
      <div
        key={index}
        className='eventWidget'
        id={`eventWidget-${event.idCal}`}
        onClick={handleOnClick}
      >
        {/*widget🔳*/}
        {event.idCal}
        {/*tag variant*/}
        {tag}
        {/*popUp📲: must be visible on click*/}
        {widgetContent}
      </div>
    </>
  );
};

export default CalendarPopUp;
