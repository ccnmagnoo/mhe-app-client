import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { IBeneficiary } from '../../../Models/Beneficiary.interface';

/*example: https://codesandbox.io/s/react-pdf-demo-i1ted?from-embed=&file=/src/index.js*/

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 20,
    padding: 10,
    flexGrow: 1,
  },
});

export const Certificate = (props: { person: IBeneficiary }) => {
  return (
    <Page size='A5' style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
    </Page>
  );
};
