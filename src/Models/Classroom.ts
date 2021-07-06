import { LandType } from '../Functions/GetTerritoryList';

import { IClassroom } from './Classroom.interface';

import { IPlace } from './Place.interface';

export class Classroom implements IClassroom {
  uuid: string;
  idCal: string;
  dateInstance: Date;
  enrolled: string[] = [];
  attendees: string[] = [];
  allowedCities: string[] = [];
  placeActivity: IPlace;
  placeDispatch?: IPlace | undefined;
  cityOnOp: string;
  colaborator: string;
  land: { type: LandType; name: string };
  vacancies?: number;

  constructor(
    uuid: string,
    idCal: string,
    enrolled: string[],
    attendees: string[],
    colaborator: string,
    city: string,
    landName: string,
    landType: LandType,
    vacancies: number,
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
    this.vacancies = vacancies;
    this.land = { type: landType, name: landName };
  }
}
