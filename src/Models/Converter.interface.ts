import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  DocumentData,
} from 'firebase/firestore';

export default interface Converter<T> {
  toFirestore: (it: WithFieldValue<T>) => DocumentData;

  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => T;
}
