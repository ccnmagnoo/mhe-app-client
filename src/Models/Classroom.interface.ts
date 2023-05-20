import { QueryDocumentSnapshot, WithFieldValue } from 'firebase/firestore';
import { LandType } from '../Functions/GetTerritoryList';
import Converter from './Converter.interface';
import { IPlace } from './Place.interface';
import IStatistics from './Statistics.interface';

export interface IRoom {
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
  op?: { uuid?: string; cur?: number };
  statistics?: Partial<IStatistics>;
  validationSince?: Date /*exceptional date allowing validation ej: case Rapa Nui*/;
}

export const iRoomConverter: Converter<IRoom> = {
  toFirestore: function (room: WithFieldValue<IRoom>) {
    return room;
  },
  fromFirestore: function (snapshot: QueryDocumentSnapshot): IRoom {
    const it = snapshot.data();

    return {
      uuid: it.uuid,
      idCal: it.idCal,
      dateInstance: it.dateInstance.toDate(),
      enrolled: it.enrolled,
      attendees: it.attendees,
      placeActivity: {
        name: it.placeActivity.name,
        dir: it.placeActivity.dir,
        date: it.placeActivity.date.toDate(),
      },
      placeDispatch: {
        name: it.placeDispatch.name,
        dir: it.placeDispatch.dir,
        date: it.placeDispatch.date.toDate(),
      },
      allowedCities: it.allowedCities,
      cityOnOp: it.cityOnOp,
      colaborator: it.colaborator,
      land: { type: it.land.type as LandType, name: it.land.name },
      vacancies: it.vacancies ?? 150,
      op: { uuid: it.op?.uuid, cur: it.op?.cur },
      statistics: it.statistics,
      validationSince: it.validationSince?.toDate(),
    };
  },
};
