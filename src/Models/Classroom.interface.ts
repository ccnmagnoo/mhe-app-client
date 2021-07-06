import { LandType } from '../Functions/GetTerritoryList';
import { IPlace } from './Place.interface';

export interface IClassroom {
  uuid: string;
  idCal: string;
  dateInstance: Date;
  enrolled: string[];
  attendees: string[];
  placeActivity: IPlace;
  placeDispatch?: IPlace;
  allowedCities: string[];
  cityOnOp: string;
  colaborator: string;
  land: { type: LandType; name: string };
  vacancies?: number;
}
