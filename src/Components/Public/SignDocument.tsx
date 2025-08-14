import { Paper, Box, Grid, Typography, Divider } from '@material-ui/core';
import { IBeneficiary } from '../../Models/Beneficiary.interface';
import { IRoom } from '../../Models/Classroom.interface';
import { currentContext as ctx } from '../../Models/Program';

export const DisclaimerDocument = (props: PropsDS) => {
  //little refs
  let p = props.person;
  const room = props.classroom;

  const personData = [
    {
      key: 'Nombre',
      value: `${p?.name.firstName ?? 'nombres'} 
      ${p?.name.fatherName ?? 'paterno'} 
        ${p?.name.motherName ?? 'materno'}`,
    },
    { key: 'Rut', value: p?.rut ?? '12.345.678-0' },
    {
      key: 'Domicilio',
      value: `${p?.address?.dir ?? 'calle Nro 0'}, ${p?.address?.city ?? 'ciudad'}`,
    },
  ];

  const signaturePad = () => {
    if (p?.sign !== undefined) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant='body2' color='primary'>
              firma beneficiado {p?.dateSign}
            </Typography>
          </Grid>
          <Grid item xs={12} justify='center'>
            firma ✨
          </Grid>
        </>
      );
    } else {
      return undefined;
    }
  };

  return (
    <>
      <Paper elevation={0} variant='outlined'>
        <Box p={3}>
          <Grid container spacing={2} justify='center' alignItems='baseline'>
            <Grid item xs={12}>
              <Typography variant='subtitle1' color='primary' align='center'>
                Identificación Conforme de Beneficio
              </Typography>
              <Typography variant='subtitle2' color='textSecondary' align='center'>
                <strong>{ctx.program}</strong> en {room?.land.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='caption' align='justify' color='textSecondary'>
                🆔: {room?.uuid} 📆idCal: {room?.idCal}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='caption' color='textSecondary' align='justify'>
                En el marco del programa
                <strong>
                  {' '}
                  de {ctx.goal} {ctx.program}
                </strong>{' '}
                , que desarrolla la SEREMI de Energía regional y la Subsecretaría de
                Energía, se deja constancia por este medio de lo siguiente que:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Grid container spacing={0}>
                {/*Person data 🙇‍♂️🙇‍♂️🙇‍♀️*/}

                {personData.map((doc, key) => {
                  return (
                    <div key={key}>
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
                    </div>
                  );
                })}
              </Grid>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <details>
                <summary
                  style={{
                    color: 'Gray',
                    fontFamily: 'calibri',
                  }}
                >
                  leer más...
                </summary>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  align='justify'
                  paragraph
                >
                  💠 Declara que reconoce la recepción de un kit del programa{' '}
                  {ctx.program} y que es de su exclusiva responsabilidad el retiro de este
                  material desde el punto de coordinado{' '}
                  {room?.placeDispatch?.dir ? 'en' : undefined} {room?.placeDispatch?.dir}
                  .
                </Typography>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  align='justify'
                  paragraph
                >
                  💠 Declara que ha recibido el kit de {ctx.program} y se compromete a
                  seguir las instrucciones sobre su uso y cuidado, garantizando su vida
                  útil y la seguridad de quienes los usen.
                </Typography>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  align='justify'
                  paragraph
                >
                  💠 Acepta que los datos que contiene esta planilla y cualquier otro
                  obtenido con motivo de esta iniciativa, se utilicen para los efectos del
                  procesamiento y tratamiento de la información, a fin de lograr un
                  adecuado monitoreo de los beneficios arriba especificados, lo anterior
                  en el marco de la Ley 19.628, sobre protección de la Vida Privada.
                </Typography>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  align='justify'
                  paragraph
                >
                  💠 Se compromete a no vender, regalar, transferir y en general a
                  comercializar el referido kit ni ninguno de sus componentes por
                  separado, ni darle un uso diverso al señalado en este documento.
                </Typography>
              </details>
            </Grid>
            <Grid item xs={12}></Grid>

            {signaturePad()}
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

type PropsDS = {
  person?: IBeneficiary;
  classroom?: IRoom;
};
