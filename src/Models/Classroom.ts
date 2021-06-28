import { Beneficiary } from './Beneficiary';
import { IClassroom } from './Classroom.interface';
import { Person } from './Person';
import { IPlace } from './Place.interface';

export class Classroom implements IClassroom {
  uuid: string;
  idCal: string;
  enrolled: Person[] = [];
  attendees: Beneficiary[] = [];
  allowedCities: string[] = [];
  placeActivity: IPlace;
  placeDispatch?: IPlace | undefined;
  city: string;

  constructor(
    uuid: string,
    idCal: string,
    enrolled: Person[],
    attendees: Beneficiary[],
    city: string,
    allowedCities: string[],
    placeActivity: IPlace,
    placeDispatch?: IPlace
  ) {
    this.uuid = uuid;
    this.idCal = idCal;
    this.enrolled = enrolled;
    this.attendees = attendees;
    this.city = city;
    this.placeActivity = placeActivity;
    this.placeDispatch = placeDispatch;
    this.allowedCities = allowedCities;
  }
}
