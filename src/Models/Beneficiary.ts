import { IBeneficiary } from './Beneficiary.interface';
import { Person } from './Person';

export class Beneficiary extends Person implements IBeneficiary {
  sign?: string | undefined;
  dateSign: Date;

  constructor(person: Person, dateSign: Date, sign?: string) {
    super(
      person.uuid,
      person.name,
      person.rut,
      person.document,
      person.email,
      person.phone,
      person.address
    );
    this.sign = sign;
    this.dateSign = dateSign;
  }
}
