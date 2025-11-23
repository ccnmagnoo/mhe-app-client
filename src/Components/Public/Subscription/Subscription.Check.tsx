import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IPerson, iPersonConverter } from '../../../Models/Person.Interface';
import { dbKey } from '../../../Models/databaseKeys';
import driver from '../../../Database/driver';
import './Subscription.css';

export const SubscriptionCheck = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get('id');

  //subscription data status
  const [subs, setSubscription] = useState<IPerson | undefined>(undefined);

  //fetch subscription data here using subscriptionId if needed
  useEffect(() => {
    //async fetch function
    const fetchSubscriptionData = async () => {
      setSubscription(await fetchSubscriptionDataById()); //reset before fetching
    };
    fetchSubscriptionData();
  }, [uuid]);

  async function fetchSubscriptionDataById() {
    console.log('fetching subscription data for uuid:', uuid);
    if (!uuid) return undefined;
    try {
      const fetchData = await driver.get<IPerson>(
        uuid,
        'doc',
        dbKey.sus,
        iPersonConverter
      );
      console.log('fetched subscription data:', fetchData);
      return fetchData as IPerson | undefined;
    } catch (error) {
      console.error('error fetching subscription data:', error);
    }
  }

  return (
    <main className='subscription-check container'>
      <section className='header'>
        <h2>estado inscripción</h2>
        {/* <p className='uuid'>{uuid}</p> */}
      </section>
      <section className='check-card'>
        <section className='card-header'>
          <div className={`card-avatar ${subs ? 'ok' : 'no'}`}>
            {subs?.name.firstName.charAt(0).toUpperCase() || '?'}
            {subs?.name.fatherName.charAt(0).toUpperCase() || '?'}
          </div>
          <div className='fullname'>
            <p>{subs?.name.firstName}</p>
            <p>
              {subs?.name.fatherName}
              {subs?.name.motherName}
            </p>
          </div>
        </section>
        <section className='card-body'>
          <div className='row'>
            <span>estado</span>
            <span aria-hidden='true'>
              <article className={`result-tag ${subs ? 'ok' : 'no'}`}>
                {subs ? <span>activo</span> : <span>inactivo</span>}
              </article>
            </span>
          </div>
          <div className='row'>
            <span>identificador</span>
            <span>{subs?.rut || '⭕'}</span>
          </div>
          <div className='row'>
            <span>fecha actividad</span>
            <span>
              {subs ? '📅' : undefined}
              {subs?.classroom.dateInstance.toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              }) || '⭕'}
            </span>
          </div>
          <div className='row'>
            <span>actividad</span>
            <span>
              {subs?.address?.city}
              {subs ? (
                <span className='idCal'>{subs?.classroom.idCal.replace('R', '✓')}</span>
              ) : (
                '⭕'
              )}
            </span>
          </div>
        </section>
        <section className='card-bottom'>
          <span>uid</span> <span>{subs?.uuid || 'no data en server'}</span>
        </section>
      </section>
    </main>
  );
};
