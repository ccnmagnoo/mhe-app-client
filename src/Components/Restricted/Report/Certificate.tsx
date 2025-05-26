import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IRoom } from '../../../Models/Classroom.interface';
import moment from 'moment';
import 'moment/locale/es'; // Pasar a español
import { currentContext } from '../../../Models/Program';

/* example: https://codesandbox.io/s/react-pdf-demo-i1ted?from-embed=&file=/src/index.js */

// Register font

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 30,
    //backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 2,
    padding: 2,
    flexGrow: 0,
  },
  image: {
    height: 90,
    marginVertical: 0,
    marginHorizontal: 100,
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'left',
    margin: 5,
  },
  text1: {
    marginHorizontal: 5,
    fontSize: 11,
    textAlign: 'left',
  },
  text2: {
    margin: 5,
    fontSize: 9,
    textAlign: 'justify',
    color: 'grey',
  },
  caption: {
    margin: 5,
    fontSize: 8,
    textAlign: 'justify',
    color: 'gray',
  },
});

export const Certificate = (props: {
  person: IBeneficiary;
  room: IRoom;
  index: number;
}) => {
  //sign

  function signature(signUrl?: string) {
    console.log('signature on server', signUrl);
    switch (signUrl) {
      case 'on-paper': {
        return <Text style={{ ...styles.subtitle, color: '#99b3ff' }}>en archivo</Text>;
      }
      case undefined: {
        return (
          <Text style={{ ...styles.caption, textAlign: 'center', color: 'lightgray' }}>
            firmar
          </Text>
        );
      }
      default: {
        return <Image style={styles.image} src={signUrl} />;
      }
    }
  }

  return (
    <Page size='A5' style={styles.page}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Image
          src={currentContext.logoUrl}
          style={{ width: '100px', objectFit: 'contain' }}
        ></Image>

        <View style={{ ...styles.section, justifyContent: 'flex-start' }}>
          <Text style={styles.title}>Recepción Conforme de Beneficio</Text>
          <Text style={styles.subtitle}>
            <strong>Programa {currentContext.program}</strong>
          </Text>
          <Text style={{ fontSize: 10, color: '#777' }}>{props.room?.colaborator}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.caption}>
          uuid:{props.person.uuid} idCal: {props.room?.idCal} version:rev.rjs.9.0
        </Text>
        <Text style={styles.text2}>
          En el marco del programa de {currentContext.goal} {currentContext.program}, que
          desarrolla la SEREMI de Energía regional y la Subsecretaría de Energía, se deja
          constancia por este medio de lo siguiente que:
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
      <View style={styles.section}>
        <Text style={styles.text2}>
          - Declara que reconoce el derecho a un solo kit del programa{' '}
          {currentContext.program} y que es de su exclusiva responsabilidad el retiro de
          este material desde el punto coordinado{' '}
          {props.room?.placeDispatch?.dir ? 'en' : undefined}{' '}
          {props.room?.placeDispatch?.dir}.
        </Text>
        <Text style={styles.text2}>
          - Declara que ha recibido el kit de {currentContext.goal} y se compromete a
          seguir las instrucciones sobre su uso y cuidado, garantizando su vida útil y la
          seguridad de quienes lo usen. .
        </Text>
        <Text style={styles.text2}>
          - Acepta que los datos que contiene esta planilla y cualquier otro obtenido con
          motivo de esta iniciativa, se utilicen para los efectos del procesamiento y
          tratamiento de la información en el marco de la Ley 19.628, sobre protección de
          la Vida Privada.
        </Text>
        <Text style={styles.text2}>
          - Se compromete a no vender, regalar, transferir y en general a comercializar el
          referido kit ni ninguno de sus componentes por separado, ni darle un uso diverso
          al señalado en este documento.
        </Text>
      </View>
      <View style={styles.section}>
        {signature(props.person.sign)}
        <Text style={{ ...styles.text1, textAlign: 'center' }}>
          firma {props.person.name.firstName} {props.person.name.fatherName}
        </Text>
        <Text style={{ ...styles.text1, textAlign: 'center' }}>
          {moment(props.person.dateSign).format('dddd DD [de] MMMM [de] YYYY')}
        </Text>
        <Text style={{ ...styles.text2, textAlign: 'center' }}>
          uuid:{props.person.uuid} index:{props.index + 1}
        </Text>
      </View>
    </Page>
  );
};
