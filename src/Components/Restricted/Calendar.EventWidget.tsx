import moment from 'moment';
import React from 'react';
import { UrlChip } from '../Public/UrlChip';
import { IEvent } from './Calendar';

const EventWidget = (props: {
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

  //sub variant event tag, class or delivery
  const tag = (isReactive?: boolean) => {
    /**
     * @param isReactive boolean true: hide on small screens, false: not hide
     */
    const permanent = isReactive ? 'permanent' : undefined;
    return (
      <span className={`myCalendar tag ${permanent} ${event.variant}`}>
        {event.variant === 'delivery' ? 'kits' : 'taller'}
      </span>
    );
  };

  const popUpDialog = (
    <div className={popUpClass()}>
      <span className='myCalendar popUp'>
        <article className='appFlex'>
          {tag(true)}
          <p>{event.colaborator}</p>
          <h3>{moment(event.info?.date).format('dd DD/MMM H:mm')}</h3>
          <p style={{ fontSize: '0.8rem' }}>{event.info?.dir}</p>
          <UrlChip url={event.info?.dir} textContent={'dirección'} />{' '}
        </article>

        <article className='appFlex right'>
          <div>suscritos</div>
          <p>{event.suscribed}</p>
          <div>entregas</div>
          <p>{event.benefited ?? 0}</p>
        </article>
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
        <div className='upper'>
          {event.idCal}
          {tag(false)}
        </div>
        <div className='bottom'>{event.land?.name}</div>

        {/*tag variant*/}

        {/*popUp📲: must be visible on click*/}
        {popUpDialog}
      </div>
    </>
  );
};

export default React.memo(EventWidget);
