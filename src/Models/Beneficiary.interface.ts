import { Gender, IPerson } from './Person.Interface';
import { firebase } from '../Config/firebase';

export interface IBeneficiary extends IPerson {
  sign?: string;
  dateSign?: Date;
}

export const iBeneficiaryConverter = {
  toFirestore: function (person: IBeneficiary) {
    return person;
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): IBeneficiary {
    const it = snapshot.data();
    return {
      uuid: it.uuid,
      name: it.name,
      rut: it.rut,
      classroom: {
        idCal: it.classroom.idCal,
        uuid: it.classroom.uuid,
        dateInstance: it.classroom.dateInstance.toDate(),
      },
      gender: it.gender as Gender,
      dateUpdate: it.dateUpdate.toDate(),
      email: it.email,
      phone: it.phone,
      address: it.address,
      sign: it?.sign,
      dateSign: it.dateSign?.toDate(),
    };
  },
};
