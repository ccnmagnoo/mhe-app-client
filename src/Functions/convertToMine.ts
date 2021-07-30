import { IClassroom } from '../Models/Classroom.interface';
import { IPerson } from '../Models/Person.Interface';

export function convertToCsv(p: IPerson, r: IClassroom, index?: number) {
  const iAttendee = r.attendees.indexOf(p.uuid);
  const validation = iAttendee === -1 ? 'no' : 'si';

  const mine: Mine = {
    id: index ?? 0,
    nombres: p.name.firstName,
    paterno: p.name.fatherName,
    materno: p.name.motherName,
    rut: p.rut,
    dir: p.address?.dir ?? 'no-data',
    comuna: p.address?.city ?? 'no-data',
    fecha: p.classroom.dateInstance.toLocaleDateString(),
    idcal: +p.classroom.idCal.slice(1),
    contact: p.email,
    phone: p.phone,
    mesa: 'mesa OL',
    genero: p.gender,
    valida: validation,
    uuid: p.uuid,
  };

  return mine;
}

export type Mine = {
  id: number;
  nombres: string;
  paterno: string;
  materno?: string;
  rut: string;
  dir: string;
  comuna: string;
  fecha: string;
  idcal: number;
  contact?: string;
  phone?: string;
  mesa?: string;
  genero: string;
  valida: 'si' | 'no';
  uuid: string;
};
