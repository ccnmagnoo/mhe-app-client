import { QueryDocumentSnapshot, WithFieldValue } from 'firebase/firestore';
import Converter from './Converter.interface';

export default interface IExternal {
  user: string;
  pass: string;
  expiration: Date;
}

export const IExternalConverter: Converter<IExternal> = {
  toFirestore: (external: WithFieldValue<IExternal>) => external,
  fromFirestore: (snapshot: QueryDocumentSnapshot): IExternal => {
    const it = snapshot.data();
    return {
      user: it.user,
      pass: it.pass,
      expiration: it.expiration.toDate(),
    };
  },
};
