import { Certificate } from './Certificate';
import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IRoom } from '../../../Models/Classroom.interface';
import { Document, pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import JSZip from 'jszip';

/**
 * @function useDocument
 * @param room IRoom document and @param people list of beneficiary
 * @ref https://muhimasri.com/blogs/how-to-save-files-in-javascript/ for JSZIP multiple
 * from blob
 * @return {Blob} array
 */
export function useGenBlob(
  room: IRoom,
  people: IBeneficiary[],
  workDone: boolean
): [Blob | undefined, 'done' | 'undone'] {
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [job_done, set_job_status] = useState<'done' | 'undone'>('undone');

  useEffect(() => {
    //generate promise blob[]

    //await documents

    const document = async () => {
      //zip build
      const zip = new JSZip();
      const blobs = await Promise.all(getPromiseBlob(room, people, workDone));

      if (workDone) {
        //snap array of blobs with signed docs

        people.forEach((person, index) => {
          zip.file(`${person.rut}.pdf`, blobs[index]);
        });
      } else {
        //snap unique blob
        zip.file(`${room.idCal}-${room.cityOnOp}.pdf`, blobs[0]);
      }

      const zippedFile = await zip.generateAsync({ type: 'blob' });
      setBlob(zippedFile);
      set_job_status('done');
    };

    document();
  }, [people, room, workDone]);

  return [blob, job_done];
}

function getPromiseBlob(
  room: IRoom,
  people: IBeneficiary[],
  workDone: boolean
): Promise<Blob>[] {
  if (workDone) {
    //return a blob for each page
    const result = people.map((p, i) => {
      const blob = (
        <Document>
          <Certificate person={p} room={room} index={i} key={i} />
        </Document>
      );

      return pdf(blob).toBlob();
    });

    return result;
  } else {
    //return a one blob with a book with documents TO SIGN
    const book = (
      <Document>
        {people.map((p, i) => {
          return <Certificate person={p} room={room} index={i} key={i} />;
        })}
      </Document>
    );
    const result = [pdf(book).toBlob()];
    return result;
  }
}
