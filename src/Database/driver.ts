import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../Config/firebase';
import Converter from '../Models/Converter.interface';
import { dbKey } from '../Models/databaseKeys';

export const driver = {
  get: async <T>(
    uid: string | undefined,
    request: 'collection' | 'doc',
    docType: dbKey.room | dbKey.cvn | dbKey.sus,
    converter: Converter<T>,
    filter: QueryConstraint[]
  ) => {
    const chain: string = `${dbKey.act}/${dbKey.uid}/${docType}`;

    switch (request) {
      case 'collection': {
        try {
          const ref = query(collection(db, chain).withConverter(converter), ...filter);
          const snap = await getDocs(ref);
          return snap.docs.map((doc) => doc.data());
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      case 'doc': {
        try {
          const ref = doc(db, chain, uid ?? 'no-uuid').withConverter(converter);
          const snap = await getDoc(ref);
          return snap.data();
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      default:
        return null;
    }
  },
};
