import { wierdFemaleNames } from '../Assets/weirdFemaleNames';
import { Dir, Gender, IPerson, Name } from './Person.Interface';

export class Person implements IPerson {
  uuid: string = 'no-init';
  name: Name;
  gender: Gender;
  rut: string;
  document: string;
  email: string;
  phone?: number | undefined;
  address?: Dir | undefined;

  constructor(
    uuid: string,
    name: Name,
    rut: string,
    document: string,
    email: string,
    phone?: number,
    address?: Dir
  ) {
    this.uuid = uuid;
    this.name = name;
    this.rut = rut;
    this.document = document;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.gender = this.getGender(name);
  }

  protected getGender(name: Name) {
    const firstName = name.firstName.toLocaleLowerCase();
    const splitName = firstName.split(' ')[0].split('').pop() ?? '0';

    if (splitName === 'a') {
      return Gender.female;
    } else if (wierdFemaleNames.indexOf(splitName) !== -1) {
      return Gender.female;
    } else {
      return Gender.male;
    }
  }
}
