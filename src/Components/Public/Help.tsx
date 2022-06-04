import { Alert } from '@material-ui/lab';
import React from 'react';
import { IRoom } from '../../Models/Classroom.interface';
import { LandType } from '../../Functions/GetTerritoryList';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button from '@material-ui/core/Button';

//external files to upload
import roomsToAdd from '../../Config/mhe-data-rooms-toAdd.json';
import cvnToAdd from '../../Config/mhe-data-benefit-toAdd.json';

import { db } from '../../Config/firebase';
import { IBeneficiary } from '../../Models/Beneficiary.interface';
import { Gender } from '../../Models/Person.Interface';
import { dbKey } from '../../Models/databaseKeys';
import { doc, setDoc } from 'firebase/firestore';

type RoomJson = {
  city: string;
  dataInstance: string;
  dir: string;
  colaborator: string;
  uuid: string;
  idcal: string;
};
type ConsolidatedJson = {
  reg: string;
  puuid: string;
  firstName: string;
  fatherName: string;
  motherName?: string;
  rut: string;
  dir: string;
  dateBenefit: string;
  city: string;
  gender: string;
  idCal: string;
  uuidRoom: string;
};

export const Help = () => {
  //room database
  const roomDatabase = roomsToAdd.rooms; /*rooms ddbb*/
  const cvn: ConsolidatedJson[][] = [
    cvnToAdd.cvn,
    //cvn00000,
    //cvn02000,
    //cvn04000,
    //cvn06000,
    //cvn08000,
    //cvn10000,
    //cvn12000,
    //cvn14000,
    //cvn16000,
    //cvn18000,
    //cvn20000,
    //cvn22000,
    //cvn24000,
    //cvn26000,
    //cvn28000,
    //cvn29000,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function uploadRooms() {
    console.log('upload click');
    console.log(
      'size of rooms list',
      roomDatabase.length,
      'size of consolidated list',
      cvn.length
    );
    const roomsToFirestore = async () => {
      for (let i = 0; i < roomDatabase.length; i++) {
        console.count('data room to upload');
        //conver to IClassroom
        const rum: RoomJson = roomDatabase[i];
        const itDate = new Date(rum.dataInstance);
        const classroom: IRoom = {
          uuid: rum.uuid,
          idCal: rum.idcal,
          dateInstance: itDate,
          enrolled: [],
          attendees: [],
          placeActivity: { name: 'no-data', dir: rum.dir, date: itDate },
          placeDispatch: { name: 'no-data', dir: rum.dir, date: itDate },
          allowedCities: [rum.city],
          cityOnOp: rum.city,
          colaborator: rum.colaborator,
          land: { type: LandType.city, name: rum.city },
        };

        //get person in repository with this on site classroom
        cvn.forEach((array) => {
          array.forEach((person) => {
            if (person.uuidRoom === classroom.uuid) {
              classroom.attendees.push(person.puuid);
              classroom.enrolled.push(person.puuid);
            }
          });
        });

        //upload to firebase:
        console.log(
          'build clasroom',
          classroom.idCal,
          'attendees',
          classroom.attendees.length
        );
        try {
          const ref = doc(db, `${dbKey.act}/${dbKey.uid}/${dbKey.room}`, classroom.uuid);
          await setDoc(ref, classroom);
          console.log('load success', classroom.idCal);
        } catch (error) {
          console.log('load fail', classroom.idCal);
        }
      }
    };
    roomsToFirestore();
    console.countReset('data room to upload');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function uploadPeople() {
    const physicalSign = 'on-paper';
    console.log('upload people click');
    console.log('size of consolidated people list', cvn.length);

    const uploadPeopleToFirebase = () => {
      try {
        //for each item on json file repository
        cvn.forEach((list) => {
          list.forEach(async (person) => {
            //build <IBeneficiary>
            console.log('preparin to upload: ', person.rut);
            const itDate = new Date(person.dateBenefit);
            const itGender = person.gender as Gender;
            const beneficiary: IBeneficiary = {
              uuid: person.puuid,
              name: {
                firstName: person.firstName,
                fatherName: person.fatherName,
                motherName: person.motherName ?? '',
              },
              rut: person.rut,
              classroom: {
                idCal: person.idCal,
                uuid: person.uuidRoom,
                dateInstance: itDate,
              },
              gender: itGender,
              dateUpdate: itDate,
              email: 'no-data',
              phone: 'no-data',
              address: { dir: person.dir, city: person.city },
              sign: physicalSign,
              dateSign: itDate,
            };
            //upload to firebase

            const ref = doc(
              db,
              `${dbKey.act}/${dbKey.uid}/${dbKey.cvn}`,
              beneficiary.uuid
            );
            await setDoc(ref, { sign: physicalSign }, { merge: true });

            console.count('success on person');
          });
        });
      } catch (error) {
        console.log('fail uploading person', error);
      }
    };

    uploadPeopleToFirebase();
    console.countReset('success on person');
  }

  return (
    <React.Fragment>
      <Alert severity='info'>sección en construcción 🚧</Alert>
      {/* <button onClick={uploadRooms}>talleres to firebase</button>*/}
      {/*<button onClick={uploadPeople}>personas to firebase</button>*/}
    </React.Fragment>
  );
};
