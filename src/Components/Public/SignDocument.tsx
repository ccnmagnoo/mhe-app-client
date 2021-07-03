import { Paper, Box, Grid, Typography, Divider } from '@material-ui/core';
import React from 'react';
import { IBeneficiary } from '../../Models/Beneficiary.interface';
import { IClassroom } from '../../Models/Classroom.interface';

export const SignDocument = (props: PropsDS) => {
  //little refs
  let pers = props.person;
  const room = props.classroom;

  const personData = [
    {
      key: 'Nombre',
      value: `${pers?.name.firstName ?? 'nombres'} 
      ${pers?.name.fatherName ?? 'paterno'} 
        ${pers?.name.motherName ?? 'materno'}`,
    },
    { key: 'Rut', value: pers?.rut ?? '12.345.678-0' },
    {
      key: 'Domicilio',
      value: `${pers?.address?.dir ?? 'calle Nro 0'}, ${pers?.address?.city ?? 'ciudad'}`,
    },
  ];

  const signSection = () => {
    if (pers?.sign !== undefined) {
      return (
        <React.Fragment>
          <Grid item xs={12}>
            <Typography variant='body2' color='primary'>
              firma beneficiado {pers?.dateSign}
            </Typography>
          </Grid>
          <Grid item xs={12} justify='center'>
            firma firma ✨
          </Grid>
        </React.Fragment>
      );
    } else {
      return undefined;
    }
  };

  return (
    <React.Fragment>
      <Paper elevation={0} variant='outlined'>
        <Box p={3}>
          <Grid container spacing={2} justify='center' alignItems='baseline'>
            <Grid item xs={12}>
              <Typography variant='subtitle1' color='primary' align='center'>
                Identificación Conforme de Beneficio
              </Typography>
              <Typography variant='subtitle2' color='textSecondary' align='center'>
                <strong>Con Buena Energía</strong> en {room?.land.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='caption' align='justify' color='textSecondary'>
                🆔: {room?.uuid} mesa: virtual idCal: {room?.idCal}{' '}
                version:rev.rjs.9.0miniApp
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='caption' color='textSecondary' align='justify'>
                En el marco del programa
                <strong> Difusión y educación para el buen uso de la energía</strong> ,
                que desarrolla la SEREMI de Energía regional y la Subsecretaría de
                Energía, se deja constancia por este medio de lo siguiente que:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Grid container spacing={0}>
                {/*Person data 🙇‍♂️🙇‍♂️🙇‍♀️*/}

                {personData.map((doc) => {
                  return (
                    <React.Fragment>
                      <Grid item xs={4}>
                        <Typography variant='body2' color='textSecondary'>
                          {doc.key}:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant='caption' color='primary'>
                          {doc.value}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant='caption'
                color='textSecondary'
                align='justify'
                paragraph
              >
                💠 Declara que reconoce el derecho a un solo kit de eficiencia energética
                y que es de su exclusiva responsabilidad el retiro de este material desde
                el punto de retiro {room?.placeDispatch?.dir ? 'en' : undefined}{' '}
                {room?.placeDispatch?.dir} y además que ha asistido a una capacitación en
                eficiencia energética.
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                align='justify'
                paragraph
              >
                💠 Se compromete a destinar el kit de eficiencia energética por este acto
                de recepción, para su uso en el domicilio familiar.
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                align='justify'
                paragraph
              >
                💠 Acepta que los datos que contiene esta planilla y cualquier otro
                obtenido con motivo de esta iniciativa, se utilicen para los efectos del
                procesamiento y tratamiento de la información, a fin de lograr un adecuado
                monitoreo de los beneficios arriba especificados, lo anterior en el marco
                de la Ley 19.628, sobre protección de la Vida Privada.
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                align='justify'
                paragraph
              >
                💠 Se compromete a no vender, regalar, transferir y en general a
                comercializar el referido pack ni ninguno de sus componentes por separado,
                ni darle un uso diverso al señalado en este documento.
              </Typography>
            </Grid>
            {signSection()}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

type PropsDS = {
  person?: IBeneficiary;
  classroom?: IClassroom;
};
