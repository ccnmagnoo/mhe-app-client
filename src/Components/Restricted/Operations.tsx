import React from 'react';
import { benefToUpdate, roomsToFix } from '../../Assets/update';
import { db } from '../../Config/firebase';
import { IBeneficiary, iBeneficiaryConverter } from '../../Models/Beneficiary.interface';
import { iClassroomConverter } from '../../Models/Classroom.interface';
import { dbKey } from '../../Models/databaseKeys';
import { Gender } from '../../Models/Person.Interface';

export const Operations = () => {
  //const [benef, setBenef] = React.useState<IBeneficiary[]>([]);

  const onClickFixBenef = async () => {
    await fetchBenefToFix();
  };

  //firebase:fetch 🔥🔥🔥
  const fetchBenefToFix = async () => {
    const year = 2019;
    const iniSearch = new Date(`${year}/01/01`);
    const endSearch = new Date(`${year}/12/31`);
    const ref = db
      .collection(`${dbKey.act}/${dbKey.uid}/${dbKey.cvn}`)
      .where('dateUpdate', '>=', iniSearch)
      .where('dateUpdate', '<=', endSearch)
      .withConverter(iBeneficiaryConverter);

    const queries = await ref.get();
    const list: IBeneficiary[] = queries.docs.map((doc) => doc.data());
    console.log('number of benefits: ', list.length);
    return list;
  };

  //firebase:push room date🔥🔥🔥
  const pushRoomDates = async () => {
    const ref = db.collection(`${dbKey.act}/${dbKey.uid}/${dbKey.room}`);
    //const roomToFixCut = [roomsToFix[0], roomsToFix[1]];

    roomsToFix.forEach(async (roomOld) => {
      //data format
      const dateToFix = new Date(roomOld.dataInstance);
      // data selectors
      const dir = roomOld.dir.split(',');
      let address = '';
      let nameAddress = '';
      switch (dir.length) {
        case 3: {
          nameAddress = dir[0];
          address = dir[1] + dir[2];
          break;
        }
        case 2: {
          nameAddress = dir[0];
          address = dir[1];
          break;
        }
        default: {
          nameAddress = dir[0];
          address = dir[0];
        }
      }
      dateToFix.setHours(15);

      const dataUpdate = {
        placeActivity: {
          date: dateToFix,
          dir: address,
          name: nameAddress,
        },
        placeDispatch: {
          date: dateToFix,
          dir: address,
          name: nameAddress,
        },
        dateInstance: dateToFix,
      };
      await ref.doc(roomOld.uuid).set(dataUpdate, { merge: true });
      console.log('room date update', roomOld.uuid);
    });
  };

  const eraseDuplicatedUUID = async () => {
    const year = 2019;
    const iniSearch = new Date(`${year}/01/01`);
    const endSearch = new Date(`${year}/12/31`);
    const ref = db
      .collection(`${dbKey.act}/${dbKey.uid}/${dbKey.room}`)
      .where('dateInstance', '>=', iniSearch)
      .where('dateInstance', '<=', endSearch)
      .withConverter(iClassroomConverter);
    //const roomToFixCut = [roomsToFix[0], roomsToFix[1]];
    const queries = await ref.get();
    const list = queries.docs.map((data) => data.data());

    const rif = db.collection(`${dbKey.act}/${dbKey.uid}/${dbKey.room}`);

    list.forEach(async (room) => {
      const attendees = room.attendees;
      const unique = new Set(attendees);
      const list: string[] = Array.from(unique);
      await rif.doc(room.uuid).set({ attendees: list, enrolled: list }, { merge: true });
      console.log(
        'duplicate erased in',
        room.idCal,
        '♻️',
        room.attendees.length,
        '->',
        list.length
      );
    });
  };

  const updateBenef = async () => {
    console.clear();
    type Source = {
      reg: string;
      uuid: string;
      firstName: string;
      fatherName: string;
      motherName: string;
      rut: string;
      dir: string;
      dateBenefit: string;
      city: string;
      idxls: string;
      gender: string;
      email: string;
      phone: string;
      idCal: string;
      roomUuid: string;
    };
    const roomList = ['R240'];
    roomList.forEach(async (idCal) => {
      const beneficiaries: Source[] = benefToUpdate.filter(
        (item) => item.idCal === idCal
      );
      const roomUuid = beneficiaries[0].roomUuid;
      const attendees = beneficiaries.map((item) => item.uuid as string);

      //ref firebase
      const refRoom = db
        .collection(`${dbKey.act}/${dbKey.uid}/${dbKey.room}`)
        .doc(roomUuid);
      const refBene = db.collection(`${dbKey.act}/${dbKey.uid}/${dbKey.cvn}`);

      //push beneficiaries ☝️;
      beneficiaries.forEach(async (bnf) => {
        const dateInstance = new Date(bnf.dateBenefit);

        //build IBeneficiary
        const bnfI: IBeneficiary = {
          address: { city: bnf.city, dir: bnf.dir },
          classroom: { dateInstance: dateInstance, idCal: bnf.idCal, uuid: bnf.roomUuid },
          dateSign: dateInstance,
          dateUpdate: dateInstance,
          email: bnf.email,
          energy: null,
          gender: bnf.gender as Gender,
          name: {
            fatherName: bnf.fatherName,
            motherName: bnf.motherName,
            firstName: bnf.firstName,
          },
          phone: null,
          rut: bnf.rut.toLocaleUpperCase(),
          sign: 'on-paper',
          uuid: bnf.uuid,
        };

        await refBene.doc(bnfI.uuid).set(bnfI);
        console.log('uploaded', bnfI.rut, bnfI.classroom.idCal);
      });
      //update room attendees
      await refRoom.set({ attendees: attendees, enrolled: attendees }, { merge: true });
      console.log('updated room', idCal, 'beneficiaries', attendees.length);
    });
  };

  return (
    <>
      <h4>performance data fix</h4>
      <p>arreglar beneficiaros con fechas mayor a 1/1/2022 </p>
      <button type='submit' className='' onClick={() => onClickFixBenef()} disabled>
        fix
      </button>
      <p>arreglar fechas actividades </p>
      <button type='submit' className='' onClick={() => pushRoomDates()} disabled>
        fix
      </button>
      <p>borrar room con attendees duplicados </p>
      <button type='submit' className='' onClick={() => eraseDuplicatedUUID()} disabled>
        fix
      </button>
      <p>subir consolidados faltantes 2019 </p>
      <button type='submit' className='' onClick={() => updateBenef()} disabled>
        fix
      </button>
    </>
  );
};
