import { IPerson } from '../Models/Person.Interface';

export function convertToMine(p: IPerson, index?: number) {
  const mine: Mine = {
    id: index ?? 0,
    nombres: p.name.firstName,
    paterno: p.name.fatherName,
    materno: p.name.fatherName,
    rut: p.rut,
    dir: p.address?.dir ?? 'no-data',
    comuna: p.address?.city ?? 'no-data',
    fecha: p.classroom.dateInstance.toLocaleDateString(),
    idcal: +p.classroom.idCal.slice(1),
    contact: p.email,
    rsh: '',
    mesa: 'mesa OL',
    genero: p.gender,
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
  rsh?: string;
  mesa?: string;
  genero: string;
};
