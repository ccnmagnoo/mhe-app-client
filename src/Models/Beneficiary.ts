import { IBeneficiary } from './Beneficiary.interface';
import { Person } from './Person';
import { IPerson } from './Person.Interface';

export class Beneficiary extends Person implements IBeneficiary {
  sign?: string | undefined;
  dateSign: Date;

  constructor(person: IPerson, dateSign: Date, sign?: string) {
    super(
      person.uuid,
      person.name,
      person.rut,
      person.email,
      person.phone,
      person.address
    );
    this.sign = sign;
    this.dateSign = dateSign;
  }
}
