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

  isRol(rol: string): boolean {
    //social number verification
    const rolChecker = (rol?: string): boolean => {
      //undefinded solution
      if (rol === undefined) {
        return false;
      }

      rol = rol?.replace('‐', '-');
      rol = rol?.split('.').join('');
      const re: RegExp = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;

      if (!re.test(rol)) {
        return false;
      } else {
        const rolSplited = rol.split('-');
        let rolDigit = rolSplited[1];
        const rolBody = rolSplited[0];

        if (rolDigit === 'K') {
          rolDigit = 'k';
        }

        return rolDigitGen(+rolBody) === rolDigit;
      }
    };

    const rolDigitGen = (rol: number): number | string => {
      //generador de verificador de código calculado
      let M = 0,
        S = 1;

      for (; rol; rol = Math.floor(rol / 10)) {
        S = (S + (rol % 10) * (9 - (M++ % 6))) % 11;
      }

      return S ? S - 1 : 'k';
    };

    return rolChecker(rol);
  }
}
