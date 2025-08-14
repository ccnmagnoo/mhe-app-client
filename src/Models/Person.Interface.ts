import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';
import Converter from './Converter.interface';
import { EnergyPoll, ResiliencePoll } from './SubscriptionData';
import { Nullable } from './Nullable';

export interface IPerson<DATE = Date> {
  uuid: string;
  name: Name;
  rut: string;
  classroom: { idCal: string; uuid: string; dateInstance: DATE };
  gender: Gender;
  dateUpdate: DATE;
  email: string;
  phone?: string | null;
  address?: Dir | null;
  energy: Nullable<EnergyPoll> | null;
  resilience: Nullable<ResiliencePoll> | null;
}

export type Name = {
  firstName: string;
  fatherName: string;
  motherName?: string;
};

export type Dir = {
  dir: string;
  city: string;
};

export enum Gender {
  male = 'M',
  female = 'F',
  nonbinary = 'N',
}

export const iPersonConverter: Converter<IPerson> = {
  toFirestore: function (it: WithFieldValue<IPerson>): DocumentData {
    return it;
  },
  fromFirestore: function (snapshot: QueryDocumentSnapshot): IPerson {
    const it = snapshot.data() as IPerson<Timestamp>;

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
      resilience: it.resilience,
    };
  },
};
