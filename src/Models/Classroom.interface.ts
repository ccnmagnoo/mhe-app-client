import { LandType } from '../Functions/GetTerritoryList';
import { Beneficiary } from './Beneficiary';
import { Person } from './Person';
import { IPlace } from './Place.interface';

export interface IClassroom {
  uuid: string;
  idCal: string;
  dateInstance: Date;
  enrolled: Person[];
  attendees: Beneficiary[];
  placeActivity: IPlace;
  placeDispatch?: IPlace;
  allowedCities: string[];
  cityOnOp: string;
  colaborator: string;
  land: { type: LandType; name: string };
}
