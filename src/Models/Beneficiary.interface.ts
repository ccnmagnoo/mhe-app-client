import { QueryDocumentSnapshot, WithFieldValue } from 'firebase/firestore';
import Converter from './Converter.interface';
import { Gender, IPerson } from './Person.Interface';

export interface IBeneficiary extends IPerson {
  sign?: string;
  dateSign?: Date;
}

export const iBeneficiaryConverter: Converter<IBeneficiary> = {
  toFirestore: function (person: WithFieldValue<IBeneficiary>) {
    return person;
  },
  fromFirestore: function (snapshot: QueryDocumentSnapshot): IBeneficiary {
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
      energy: it.energy,
      sign: it?.sign,
      dateSign: it.dateSign?.toDate(),
    };
  },
};
