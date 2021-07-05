import { Alert } from '@material-ui/lab';
import React from 'react';
import Button from '@material-ui/core/Button';
import { IClassroom } from '../../Models/Classroom.interface';
import { LandType } from '../../Functions/GetTerritoryList';

//external files to upload
import roomsddbb from '../../Config/mhe-data-rooms.json';
import cvn02000 from '../../Config/mhe-data-benefit-02000.json';
import cvn04000 from '../../Config/mhe-data-benefit-04000.json';
import cvn06000 from '../../Config/mhe-data-benefit-06000.json';
import cvn08000 from '../../Config/mhe-data-benefit-08000.json';
import cvn10000 from '../../Config/mhe-data-benefit-10000.json';
import cvn12000 from '../../Config/mhe-data-benefit-12000.json';
import cvn14000 from '../../Config/mhe-data-benefit-14000.json';
import cvn16000 from '../../Config/mhe-data-benefit-16000.json';
import cvn18000 from '../../Config/mhe-data-benefit-18000.json';
import cvn20000 from '../../Config/mhe-data-benefit-20000.json';
import cvn22000 from '../../Config/mhe-data-benefit-22000.json';
import cvn24000 from '../../Config/mhe-data-benefit-22000.json';
import cvn26000 from '../../Config/mhe-data-benefit-26000.json';
import cvn28000 from '../../Config/mhe-data-benefit-28000.json';

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
  motherName: string;
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
  const roomDatabase = roomsddbb.classrooms; /*rooms ddbb*/
  const cvn: ConsolidatedJson[][] = [
    cvn02000,
    cvn04000,
    cvn06000,
    cvn08000,
    cvn10000,
    cvn12000,
    cvn14000,
    cvn16000,
    cvn18000,
    cvn20000,
    cvn22000,
    cvn24000,
    cvn26000,
    cvn28000,
  ];

  function upload() {
    console.log('upload click');
    console.log(
      'size of rooms list',
      roomDatabase.length,
      'size of consolidated list',
      cvn.length
    );

    const toFirestore = async () => {
      for (let i = 0; i < 2 /*roomDatabase.length*/; i++) {
        console.count('data room to upload');
        //conver to IClassroom
        const rum: RoomJson = roomDatabase[i];
        const itDate = new Date(rum.dataInstance);
        const classroom: IClassroom = {
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

        //get enrolled in this classroom
      }
    };

    //toFirestore();
    console.countReset('data room to upload');
  }

  return (
    <React.Fragment>
      <Alert severity='info'>sección en construcción 🚧</Alert>
      <Button variant='text' color='secondary' onClick={upload}>
        populate firebase
      </Button>
    </React.Fragment>
  );
};
