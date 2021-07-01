export interface IConsolidated {
  uuid: string;
  classroom: { idCal: string; uuid: string; dateInstance: Date };
  dateBenefit: Date;
  rut: string;
  sign: string;
}
