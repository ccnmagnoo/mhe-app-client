import React from 'react';
import { refUuid } from '../../../Config/credential';
import { db } from '../../../Config/firebase';
import { iClassroomConverter } from '../../../Models/Classroom.interface';
import { dbKey } from '../../../Models/databaseKeys';
import { Context } from '../Context/context';
import { ActionType } from '../Context/reducer';

export const useFetchRooms = () => {
  const context = React.useContext(Context);

  React.useEffect(() => {
    console.log('period change detected');
    fetchRooms(context.period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.period]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchRooms(period: number) {
    const timeGap = {
      ini: new Date(`${period}/1/1`),
      end: new Date(`${period}/12/31`),
      now: new Date(),
    };
    //firebase 🔥🔥🔥
    const ref = db
      .collection(`${dbKey.act}/${refUuid}/${dbKey.room}`)
      .where('placeActivity.date', '>=', timeGap.ini)
      .where('placeActivity.date', '<=', timeGap.end)
      .orderBy('placeActivity.date', 'desc')
      .withConverter(iClassroomConverter);

    const snapshot = await ref.get();
    const rooms = snapshot.docs.map((query) => {
      return query.data();
    });
    //.sort((a, b) => (a.placeActivity.date > b.placeActivity.date ? -1 : 1))
    console.log('useFetchRooms() got this rooms', rooms.length);
    context.changeState({ type: ActionType.setRooms, payload: rooms });
  }

  return null;
};
