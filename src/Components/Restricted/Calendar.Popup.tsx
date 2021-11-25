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
    return isActive ? 'backgroundPopup show' : 'backgroundPopup';
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

  const popUpDialog = (
    <div className={popUpClass()}>
      <span className='myCalendar popUp'>
        <section style={{ display: 'flex' }}>
          <div style={{ padding: '5px', alignContent: 'middle', maxWidth: '300px' }}>
            {tag}
            <p>{event.colaborator}</p>

            <div style={{ padding: '0px 0px 0px 0px' }}>
              <h3>{moment(event.info?.date).format('DD/MMM H:mm')}</h3>
              <UrlChip url={event.info?.dir} textContent={event.info?.dir} />{' '}
            </div>
          </div>

          <article></article>
        </section>
      </span>
    </div>
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
        {popUpDialog}
      </div>
    </>
  );
};

export default CalendarPopUp;
