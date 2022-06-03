import { QueryDocumentSnapshot } from 'firebase/firestore';

export default interface Converter<T> {
  toFirestore([key:string]: T): T;
  fromFirestore(snapshot: QueryDocumentSnapshot): T;
}
