import { Certificate } from './Certificate';
import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IRoom } from '../../../Models/Classroom.interface';
import { Document, pdf } from '@react-pdf/renderer';

export async function useDocument(room: IRoom, people: IBeneficiary[]) {
  const blobList = people.map((p, i) => {
    const blob = (
      <Document>
        <Certificate person={p} room={room} index={i} key={i} />
      </Document>
    );
    return pdf(blob).toBlob();
  });

  const document = await Promise.all(blobList);

  return document;
}
