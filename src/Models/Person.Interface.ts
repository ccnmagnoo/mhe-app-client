export interface IPerson {
  uuid: string;
  name: Name;
  rut: string;
  classroom: { idCal: string; uuid: string; dateInstance: Date };
  gender: Gender;
  dateUpdate: Date;
  email: string;
  phone?: string;
  address?: Dir;
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
}
