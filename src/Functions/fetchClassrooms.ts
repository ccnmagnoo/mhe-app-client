import { orderBy, where } from 'firebase/firestore';
import driver from '../Database/driver';
import { IRoom, iRoomConverter } from '../Models/Classroom.interface';
import { dbKey } from '../Models/databaseKeys';
import { InputSubscription } from '../Models/SubscriptionData';
import { currentContext } from '../Models/Program';
import { Dispatch, SetStateAction } from 'react';

/**
 * @function fetchClassrooms got active incoming classrooms
 * INSIDE the territory subscription
 */
async function fetchClassrooms(
  data: InputSubscription,
  dispatch: Dispatch<SetStateAction<IRoom[]>>,
  overSubscription: boolean = true
) {
  try {
    //firestore🔥🔥🔥: fetch incoming classes
    /**
     * @param backwardDays is how many days back is a classroom
     *  will keep open to subscribed in,  on cases for late subscriptions
     * if value= 0 so subscription will close at start room date.
     *
     */
    //time restriction
    console.log('requested city', data.city, '');
    const restrictionTime = new Date();
    if (!overSubscription) {
      //normal: get last 14 days Rooms
      const backwardDays = +(process.env.REACT_APP_SUBSCRIPTION_TIME_GAP ?? 14);
      restrictionTime.setDate(restrictionTime.getDate() - backwardDays);
    } else {
      //oversubscription true: set init year
      restrictionTime.setDate(1);
      restrictionTime.setMonth(0);
      restrictionTime.setHours(0, 0);
    }
    //firebase getting rooms available
    const rooms = (await driver.get<IRoom>(
      undefined,
      'collection',
      dbKey.room,
      iRoomConverter,
      where('dateInstance', '>', restrictionTime),
      where('allowedCities', 'array-contains', data.city),
      orderBy('dateInstance', 'desc')
    )) as IRoom[];

    console.log('incoming classrooms', rooms, 'oversubscription:', overSubscription);

    //filtering  available rooms by vacancies, or oversubscription su.
    const available_rooms: IRoom[] = !overSubscription
      ? rooms.filter((room) => {
          //filtering rooms with vacancies

          const vacancies: number = room.vacancies ?? 120;
          return (
            room.enrolled.length < vacancies && room.program === currentContext.program
          );
        })
      : rooms; //full rooms;

    console.log(
      'list of available classrooms on city',
      data.city,
      available_rooms.length,
      available_rooms.map((it) => it.idCal)
    );

    //set near classrooms available state  🎣
    dispatch(() => available_rooms);

    return available_rooms.length > 0 ? true : false;
  } catch (error) {
    console.log('fetch classrooms', error);
  }
}

export default fetchClassrooms;
