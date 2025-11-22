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
        <p className='uuid'>{uuid}</p>
      </section>
      <section className={`result-tag ${subs ? 'ok' : 'no'}`}>
        {subs ? <span>ok</span> : <span>no existe</span>}
      </section>
      <section className='data'>
        <p>
          {subs?.name.firstName} {subs?.name.fatherName} {subs?.name.motherName} <br />
          {subs?.rut} <br />
        </p>
        <p>
          inscripción <strong>{subs?.classroom.idCal}</strong>
          {'📅'}
          {subs?.classroom.dateInstance.toLocaleDateString('es-CL')}
        </p>
      </section>
    </main>
  );
};
