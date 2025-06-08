import { where } from 'firebase/firestore';
import driver from '../Database/driver';
import { dbKey } from '../Models/databaseKeys';
import { InputSubscription } from '../Models/SubscriptionData';
import { capitalWord } from './capitalWord';
import { IPerson, iPersonConverter } from '../Models/Person.Interface';
import { IRoom } from '../Models/Classroom.interface';
import { isRol, RolRequest } from './isRol';
import { Dispatch, SetStateAction } from 'react';
import someTrue from './someTrue';
import { getGender } from './getGender';
import { Nullable } from '../Models/Nullable';

async function createSubscription(
  data: InputSubscription,
  selectedRoom: IRoom,
  errorDispatch: Dispatch<SetStateAction<{ value: boolean; message: string } | null>>,
  rolRequest?: RolRequest
) {
  try {
    //check if it's there a room selected ❓❓
    if (selectedRoom === undefined) {
      console.log("isn't a selected room", undefined);
      errorDispatch({
        value: true,
        message: 'no has seleccionado un taller 🙊 ',
      });
      return false;
    }

    //check rolRequest null state
    if (rolRequest?.rol === undefined) {
      console.log('check rol is ', undefined);
      errorDispatch({
        value: true,
        message: 'rut mal definido 🙊 ',
      });
      return false;
    }

    //check the selected ROOM has already this RUT 🔎👤

    //fetch actual RUT subscription instances
    const subscriptions = (await driver.get(
      undefined,
      'collection',
      dbKey.sus,
      iPersonConverter,
      where('rut', '==', isRol(data.rut).rol)
    )) as IPerson[];

    //room uuid subscription check
    const isSubscribed = subscriptions.some(
      (it) => it.classroom.uuid === selectedRoom?.uuid
    );

    if (isSubscribed) {
      console.log('on previous existence on this room', selectedRoom?.idCal);
      errorDispatch({
        value: true,
        message: 'tranquilidad, ya estabas a este taller 🤔 ',
      });
      return false;
    }

    if (!isSubscribed) {
      //prepare to upload new subscription
      console.log('prepare to upload subscription', data.email);
      const now = new Date();

      //create reference of new doc Subscribed
      const person: IPerson = {
        uuid: '',
        name: {
          firstName: capitalWord(data.name),
          fatherName: capitalWord(data.fatherName),
          motherName: capitalWord(data.motherName),
        },
        rut: rolRequest.rol,
        gender: getGender(data.name),
        classroom: {
          idCal: selectedRoom?.idCal ?? null,
          uuid: selectedRoom?.uuid ?? null,
          dateInstance: selectedRoom?.dateInstance ?? now,
        },
        dateUpdate: now,
        email: data.email.toLowerCase(),
        phone: data.phone,
        address: {
          dir:
            data.dir !== undefined ? capitalWord(data.dir.toLowerCase()) : 'no-informa',
          city: data.city,
        },
        energy: {
          electricBill: data.electricBill,
          electricity: data.electricity,
          gasBill: data.gasBill,
          gasDuration: data.gasDuration,
        },
        resilience: {
          energy_cut: data.energy_cut,
          emergency_contact: data.emergency_contact,
          is_risk_zone: someTrue(data.risk_zone) ?? false,
          risk_zone: data.risk_zone,
          has_damage_experience: someTrue(data.damage_experience) ?? false,
          damage_experience: data.damage_experience,
        },
      };

      //set new subscription 🔥🔥🔥
      await driver.set(dbKey.sus, person, iPersonConverter);

      console.log('subscription success 👌', person.rut, '➡', selectedRoom?.idCal);
      errorDispatch({ value: false, message: 'felicidades, ya estás participando ' });

      //set new enrolled 🔥🔥🔥 (moved to cloud functions)

      const enrolled = selectedRoom?.enrolled;
      if (enrolled !== undefined && enrolled.indexOf(person.uuid!!) === -1) {
        //update classroom enrolled list is doesn't exist, avoid duplication
        //enrolled?.push(person.uuid);
        //refRoom.set({ enrolled: enrolled }, { merge: true });
        console.log('updated classroom enrolled', person.uuid, 'rut:', person.rut);
      }

      return true;
    }
  } catch (error) {
    errorDispatch({ value: false, message: `app error: ${error}` });
    console.log('no upload', error, data);
    return false;
  }
}

export default createSubscription;
