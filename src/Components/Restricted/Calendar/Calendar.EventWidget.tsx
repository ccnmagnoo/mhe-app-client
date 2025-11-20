import moment from 'moment';
import React from 'react';
import { UrlChip } from '../../Public/UrlChip';
import { IEvent } from './Calendar';
import './calendar.css';
import {
  CopyIcon,
  FreeIcon,
  KeyIcon,
  SubscribedIcon,
  VacancyIcon,
  ValidatedIcon,
} from '../../../Assets/icon';
import restVacancies from '../../../Functions/restVacancies';

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
      <span className={`tag ${permanent} ${event.variant}`}>
        {event.variant === 'delivery' ? 'kit' : 'taller'}
      </span>
    );
  };

  const popUpDialog = (
    <div className={popUpClass()}>
      <article className='popUp'>
        <section className='header'>
          <h4>actividad {tag()}</h4>
          <p>
            {event.land?.name}📅
            {moment(event?.place?.date ?? new Date()).format('DD/MM/YY H:mm')}h
          </p>
        </section>
        <section className='command'>
          <button className='validate-code-button'>
            código valida <KeyIcon /> {event.idCal?.slice(1)}{' '}
            <CopyIcon style={{ color: '#ddd' }} />
          </button>
        </section>
        <section className='statistic'>
          <article>
            <VacancyIcon color='primary' />
            <h5>cupos</h5>
            <p>{event.vacancy}</p>
          </article>
          <article>
            <SubscribedIcon color='primary' />
            <h5>inscritos</h5>
            <p>{event.subscribed}</p>
          </article>
          <article>
            <FreeIcon color='primary' />
            <h5>libres</h5>
            <p>{restVacancies(event.vacancy, event.subscribed)}</p>
            <meter max={event.vacancy} value={event.subscribed}></meter>
          </article>
          <article>
            <ValidatedIcon color='primary' />
            <h5>validados</h5>
            <p>{event.validated}</p>

            <meter max={event.subscribed} value={event.validated}></meter>
          </article>
        </section>
      </article>
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
          <span style={{ fontFamily: 'sans-serif' }}>{event.idCal?.slice(1)}</span>{' '}
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
