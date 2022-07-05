import { Certificate } from './Certificate';
import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IRoom } from '../../../Models/Classroom.interface';
import { Document, pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

/**
 * @function useDocument
 * @param room IRoom document and @param people list of beneficiary
 * @ref https://muhimasri.com/blogs/how-to-save-files-in-javascript/ for JSZIP multiple
 * from blob
 * @return Blob array
 */
export function useDocument(room: IRoom, people: IBeneficiary[]) {
  const [blob, setBlob] = useState<Blob[] | undefined>(undefined);
  useEffect(() => {
    const blobList = people.map((p, i) => {
      const blob = (
        <Document>
          <Certificate person={p} room={room} index={i} key={i} />
        </Document>
      );
      return pdf(blob).toBlob();
    });

    const document = async () => {
      const fetch = await Promise.all(blobList);
      setBlob(fetch);
    };

    document();
  }, [people, room]);

  return blob;
}
