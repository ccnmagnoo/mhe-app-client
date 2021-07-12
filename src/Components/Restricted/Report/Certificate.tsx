import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Page, Text, View, StyleSheet, Svg, Font, Image } from '@react-pdf/renderer';
import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IClassroom } from '../../../Models/Classroom.interface';

/* example: https://codesandbox.io/s/react-pdf-demo-i1ted?from-embed=&file=/src/index.js */

// Register font

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    //backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    margin: 12,
  },
  text1: {
    margin: 10,
    fontSize: 11,
    textAlign: 'justify',
  },
  text2: {
    margin: 10,
    fontSize: 11,
    textAlign: 'justify',
    color: 'grey',
  },
  caption: {
    margin: 10,
    fontSize: 8,
    textAlign: 'justify',
    color: 'black',
  },
});

export const Certificate = (props: { person: IBeneficiary; room: IClassroom }) => {
  //sign
  const parse = new DOMParser();

  const sign = parse.parseFromString(props.person.sign ?? '<svg></svg>', 'image/svg+xml');
  console.log('parse sign', sign);

  return (
    <Page size='A5' style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}> Identificación Conforme de Beneficio</Text>
        <Text style={styles.subtitle}>
          <strong>Con Buena Energía</strong> {props.room?.colaborator}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.caption}>idCal: {props.room?.idCal} version:rev.rjs.9.0</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text2}>
          En el marco del programa Difusión y educación para el buen uso de la energía,
          que desarrolla la SEREMI de Energía regional y la Subsecretaría de Energía, se
          deja constancia por este medio de lo siguiente que:
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text1}>
          nombre: {props.person.name.firstName} {props.person.name.fatherName}{' '}
          {props.person.name.motherName}
        </Text>
        <Text style={styles.text1}>rut: {props.person.rut}</Text>
        <Text style={styles.text1}>dirección: {props.person.address?.dir}</Text>
        <Text style={styles.text1}>comuna: {props.person.address?.city}</Text>
      </View>
    </Page>
  );
};
