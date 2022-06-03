import { QueryDocumentSnapshot } from 'firebase/firestore';

export default interface Converter<T> {
  toFirestore(val: T): T;
  fromFirestore(snapshot: QueryDocumentSnapshot): T;
}
