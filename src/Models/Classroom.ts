import { LandType } from '../Functions/GetTerritoryList';
import { Beneficiary } from './Beneficiary';
import { IClassroom } from './Classroom.interface';
import { Person } from './Person';
import { IPlace } from './Place.interface';

export class Classroom implements IClassroom {
  uuid: string;
  idCal: string;
  dateInstance: Date;
  enrolled: Person[] = [];
  attendees: Beneficiary[] = [];
  allowedCities: string[] = [];
  placeActivity: IPlace;
  placeDispatch?: IPlace | undefined;
  cityOnOp: string;
  colaborator: string;
  land: { type: LandType; name: string };

  constructor(
    uuid: string,
    idCal: string,
    enrolled: Person[],
    attendees: Beneficiary[],
    colaborator: string,
    city: string,
    landName: string,
    landType: LandType,
    allowedCities: string[],
    placeActivity: IPlace,
    placeDispatch?: IPlace
  ) {
    this.uuid = uuid;
    this.idCal = idCal;
    this.enrolled = enrolled;
    this.attendees = attendees;
    this.cityOnOp = city;
    this.placeActivity = placeActivity;
    this.placeDispatch = placeDispatch;
    this.allowedCities = allowedCities;
    this.dateInstance = placeActivity.date;
    this.colaborator = colaborator;
    this.land = { type: landType, name: landName };
  }
}
