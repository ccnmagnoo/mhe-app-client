import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
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
    console.log('fetch rooms all period ', context.rooms.length);

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
    // const ref = db
    //   .collection(`${dbKey.act}/${refUuid}/${dbKey.room}`)
    //   .where('placeActivity.date', '>=', timeGap.ini)
    //   .where('placeActivity.date', '<=', timeGap.end)
    //   .orderBy('placeActivity.date', 'desc')
    //   .withConverter(iClassroomConverter);

    const q = query(
      collection(db, `${dbKey.act}/${refUuid}/${dbKey.room}`).withConverter(
        iClassroomConverter
      ),
      where('placeActivity.date', '>=', timeGap.ini),
      where('placeActivity.date', '<=', timeGap.end),
      orderBy('placeActivity.date', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      //change observer
      console.clear();

      snapshot.docChanges().forEach((change, index, list) => {
        switch (change.type) {
          case 'added': {
            const data = change.doc.data();
            console.log('fetch Room add:', data.idCal, 'at index', change.newIndex);
            return context.changeState({
              type: ActionType.setRoom,
              payload: data,
              index: change.newIndex,
            });
            //return (listOfRooms[index] = data);
          }

          case 'modified': {
            //updates class as index 0 and 1 and 0, several times
            const data = change.doc.data();
            console.log('fetch Room update:', data.idCal, 'at index', index);
            //return listOfRooms.splice(index, 1, data);
            return context.changeState({
              type: ActionType.updateRoom,
              payload: data,
              index: index,
            });
          }
          case 'removed': {
            return context.changeState({
              type: ActionType.delRoom,
              payload: change.doc.data(),
              index: index,
            });
          }

          default:
            return undefined;
        }
      });
    });
  }

  return null;
};
