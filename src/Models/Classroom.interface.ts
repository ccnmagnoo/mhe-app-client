import { Beneficiary } from './Beneficiary';
import { Person } from './Person';
import { IPlace } from './Place.interface';

export interface IClassroom {
  uuid: string;
  idCal: string;
  enrolled: Person[];
  attendees: Beneficiary[];
  placeActivity: IPlace;
  placeDispatch?: IPlace;
  allowedCities: string[];
  city: string;
}
