export interface IPerson {
  uuid: string;
  name: Name;
  rut: string;
  document: string;
  email: string;
  phone?: number;
  address?: Dir;
  gender: Gender;
}

export type Name = {
  firstName: string;
  fatherName: string;
  motherName?: string;
};

export type Dir = {
  street: string;
  city: string;
};

export enum Gender {
  male = 'M',
  female = 'F',
}
