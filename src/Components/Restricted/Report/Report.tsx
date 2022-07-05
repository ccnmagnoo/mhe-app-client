import { Document } from '@react-pdf/renderer';

import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IRoom } from '../../../Models/Classroom.interface';
import { Certificate } from './Certificate';

/*example: https://codesandbox.io/s/react-pdf-demo-i1ted?from-embed=&file=/src/index.js*/

//document
export const Report = (props: { room: IRoom; people: IBeneficiary[] }) => {
  return (
    <Document>
      {props.people.map((p, i) => {
        return <Certificate person={p} room={props.room} index={i} key={i} />;
      })}
    </Document>
  );
};
