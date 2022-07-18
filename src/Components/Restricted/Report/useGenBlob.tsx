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
export function useGenBlob(room: IRoom, people: IBeneficiary[], workDone: boolean) {
  const [blob, setBlob] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    //generate promise blob[]
    const snapBlobs = getPromiseBlob(room, people, workDone);

    //await documents

    const document = async () => {
      //zip build
      const zip = new JSZip();

      if (workDone) {
        //snap array of blobs
        const blobs = await Promise.all(snapBlobs as Promise<Blob>[]);
        people.forEach((person, index) => {
          zip.file(`${person.rut}.pdf`, blobs[index]);
        });
      } else {
        //snap unique blob
        const blob = await (snapBlobs as Promise<Blob>);
        zip.file(`print-me.pdf`, blob);
      }

      const zippedFile = await zip.generateAsync({ type: 'blob' });

      setBlob(zippedFile);
    };

    document();
  }, [people, room, workDone]);

  return blob;
}

function getPromiseBlob(
  room: IRoom,
  people: IBeneficiary[],
  workDone: boolean
): Promise<Blob>[] | Promise<Blob> {
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
    //return a one blob
    const book = (
      <Document>
        {people.map((p, i) => {
          return <Certificate person={p} room={room} index={i} key={i} />;
        })}
      </Document>
    );
    const result = pdf(book).toBlob();
    return result;
  }
}
