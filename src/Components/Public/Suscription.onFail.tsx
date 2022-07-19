import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export const OnFailSuscription = () => {
  const mailTo =
    'mailto:ccamposn@minenergia.cl?subject=consulta CBE desde mini app&body=incluir nombre completo, rut y su comuna. motivo: no he encontrado un taller disponible'.replace(
      ' ',
      '%20'
    );

  return (
    <Grid item xs={12}>
      {/*mini card with no room avaliable 🙅‍♂️⛔*/}
      <Card>
        <CardHeader
          avatar={<Avatar aria-label='idcal'>?</Avatar>}
          action={
            <IconButton aria-label='seleccionar'>
              <CheckCircleIcon color='action' />
            </IconButton>
          }
          title='Lo sentimos'
          subheader='No nos quedan más vacantes ☹️'
        />
        <CardContent>
          <Typography variant='subtitle2' color='primary'>
            ¿Como puedo participar en un taller?
          </Typography>
          <Typography variant='body2' color='textSecondary' paragraph align='justify'>
            Los talleres son implementados por el Ministerio de energía en coordinación
            con una
            <strong> institución municipal o servicio público</strong>, eventualmente
            realizaremos más talleres en su sector, por lo que le solicitamos estar
            atent@s en sus redes de información, o bien puede consultarnos a{' '}
            <strong>
              <a href={mailTo}>este email. </a>
            </strong>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
