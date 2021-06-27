import { IPerson } from './Person.Interface';

export interface IBeneficiary extends IPerson {
  sign?: string;
  dateSign: Date;
}
