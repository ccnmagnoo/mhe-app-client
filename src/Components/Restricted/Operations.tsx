import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { benefToUpdate, roomsToFix } from '../../Assets/update';
import { db } from '../../Config/firebase';
import driver from '../../Database/driver';
import { IBeneficiary, iBeneficiaryConverter } from '../../Models/Beneficiary.interface';
import { iRoomConverter } from '../../Models/Classroom.interface';
import { dbKey } from '../../Models/databaseKeys';
import { Gender } from '../../Models/Person.Interface';

export const Operations = () => {
  const onClickFixBenef = async () => {
    await fetchBenefToFix();
  };

  //firebase:fetch 🔥🔥🔥
  const fetchBenefToFix = async () => {
    const year = 2019;
    const iniSearch = new Date(`${year}/01/01`);
    const endSearch = new Date(`${year}/12/31`);

    const consolidated = (await driver.get<IBeneficiary>(
      undefined,
      'collection',
      dbKey.cvn,
      iBeneficiaryConverter,
      where('dateUpdate', '>=', iniSearch),
      where('dateUpdate', '<=', endSearch)
    )) as IBeneficiary[];

    console.log('number of benefits: ', consolidated.length);
    return consolidated;
  };

  //firebase:push room date🔥🔥🔥
  const pushRoomDates = async () => {
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

      // const ref = db.collection(`${dbKey.act}/${dbKey.uid}/${dbKey.room}`);
      const ref = doc(db, `${dbKey.act}/${dbKey.uid}/${dbKey.room}`, roomOld.uuid);
      await setDoc(ref, dataUpdate, { merge: true });
      console.log('room date update', roomOld.uuid);
    });
  };

  const eraseDuplicatedUUID = async () => {
    const year = 2019;
    const iniSearch = new Date(`${year}/01/01`);
    const endSearch = new Date(`${year}/12/31`);

    //get Classrooms form a periord year
    const refRoom = query(
      collection(db, `${dbKey.act}/${dbKey.uid}/${dbKey.room}`).withConverter(
        iRoomConverter
      ),
      where('dateInstance', '>=', iniSearch),
      where('dateInstance', '<=', endSearch)
    );
    const queries = await getDocs(refRoom);
    const list = queries.docs.map((data) => data.data());

    list.forEach(async (room) => {
      //erase attendess duplicated
      const attendees = room.attendees;
      const unique = new Set(attendees);
      const list: string[] = Array.from(unique);
      // ref
      const docRef = doc(db, `${dbKey.act}/${dbKey.uid}/${dbKey.room}`, room.uuid);

      await setDoc(docRef, { attendees: list }, { merge: true });
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
    const roomList = ['R240']; //tom;
    roomList.forEach(async (idCal) => {
      const beneficiaries: Source[] = benefToUpdate.filter(
        (item) => item.idCal === idCal
      );
      const roomUuid = beneficiaries[0].roomUuid;
      const attendees = beneficiaries.map((item) => item.uuid as string);

      const ref = doc(db, `${dbKey.act}/${dbKey.uid}/${dbKey.room}`, roomUuid);

      //push beneficiaries ☝️;
      beneficiaries.forEach(async (bnf) => {
        const dateInstance = new Date(bnf.dateBenefit);

        //build IBeneficiary
        const beneficiary: IBeneficiary = {
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

        await setDoc(ref, beneficiary);
        console.log('uploaded', beneficiary.rut, beneficiary.classroom.idCal);
      });
      //update room attendees
      await setDoc(ref, { attendees: attendees }, { merge: true });
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
