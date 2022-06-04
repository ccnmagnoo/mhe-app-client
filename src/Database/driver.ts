import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  setDoc,
} from 'firebase/firestore';
import { db } from '../Config/firebase';
import Converter from '../Models/Converter.interface';
import { dbKey } from '../Models/databaseKeys';

const driver = {
  //fucntion firebase modular web 9 driver,
  get: async <T>(
    uid: string | undefined,
    request: 'collection' | 'doc',
    docType: dbKey.room | dbKey.cvn | dbKey.sus | dbKey.ext,
    converter: Converter<T>,
    ...filter: QueryConstraint[]
  ) => {
    const path: string = `${dbKey.act}/${dbKey.uid}/${docType}`;

    switch (request) {
      case 'collection': {
        try {
          const ref = query(collection(db, path).withConverter(converter), ...filter);
          const snap = await getDocs(ref);
          return snap.docs.map((doc) => doc.data());
        } catch (error) {
          console.log(error);
          return undefined;
        }
      }
      case 'doc': {
        try {
          const ref = doc(db, path, uid ?? 'no-uuid').withConverter(converter);
          const snap = await getDoc(ref);
          return snap.data();
        } catch (error) {
          console.log(error);
          return undefined;
        }
      }
      default:
        return undefined;
    }
  },
  set: async <T>(
    docType: dbKey.room | dbKey.cvn | dbKey.sus,
    document: T,
    converter: Converter<T>
  ) => {
    const path: string = `${dbKey.act}/${dbKey.uid}/${docType}`;

    try {
      const ref = collection(db, path).withConverter(converter);
      const push = await addDoc(ref, document);
      await setDoc(doc(db, path, push.id), { uuid: push.id }, { merge: true });
    } catch (error) {
      console.log(error);
    }
  },
};

export default driver;
