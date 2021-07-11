import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IClassroom } from '../../../Models/Classroom.interface';
import { Certificate } from './Certificate';

// Create styles
/*example: https://codesandbox.io/s/react-pdf-demo-i1ted?from-embed=&file=/src/index.js*/

//document
export const Report = (props: { room: IClassroom; people: IBeneficiary[] }) => {
  return (
    <Document>
      {props.people.map((p) => {
        return <Certificate person={p} />;
      })}
    </Document>
  );
};
