import {
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormLabel,
  FormGroup,
  FormHelperText,
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { InputSubscription as IS } from '../../Models/SubscriptionData';
import Checkbox from '@material-ui/core/Checkbox';

type Props<T extends FieldValues> = {
  trigger: boolean;
  form: UseFormReturn<T>;
};

export const EnergyPollForm = (props: Props<IS>) => {
  const { trigger: disableB, form } = props;
  const {
    register,
    formState: { errors },
  } = form;

  const controlGroup = (
    risk_zone: Parameters<typeof form.getValues>[0][0],
    risk_title: string
  ) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              onChange={() => {
                const param = form.getValues(risk_zone);
                form.setValue(risk_zone, !param as never);
              }}
              name={risk_zone.toString()}
            />
          }
          label={risk_title}
        />
      </FormGroup>
    );
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper
          variant='outlined'
          color='secondary'
          style={{ backgroundColor: indigo[50] }}
        >
          <Box margin={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant='body2' color='primary'>
                  ⚡ Encuesta energética
                </Typography>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  paragraph
                  align='left'
                >
                  Encuesta opcional que nos ayuda a mejorar nuestros programas de
                  beneficios✨.
                </Typography>
              </Grid>

              <Grid item xs={5} sm={5}>
                <TextField
                  disabled={disableB}
                  fullWidth
                  id='name-field'
                  label='gasto eléctrico mensual'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  }}
                  type='number'
                  variant='standard'
                  {...register('electricBill', {
                    min: { value: 1_000, message: 'mínimo $1.000' },
                    max: { value: 1_000_000, message: 'demasiado grande' },
                  })}
                  error={errors.electricBill && true}
                  helperText={errors.electricBill?.message}
                />
              </Grid>
              <Grid item xs={7} sm={7}>
                {/* energy use */}
                <TextField
                  disabled={disableB}
                  fullWidth
                  id='name-field'
                  label='consumo eléctrico'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>kWh</InputAdornment>,
                  }}
                  type='number'
                  variant='standard'
                  {...register('electricity', {
                    min: { value: 10, message: 'mínimo 10 kWh' },
                    max: { value: 5_000, message: 'demasiado grande' },
                  })}
                  error={errors.electricity && true}
                  helperText={errors.electricity?.message}
                />
              </Grid>
              <Grid item xs={5} sm={5}>
                {/* gas use */}
                <TextField
                  disabled={disableB}
                  fullWidth
                  id='gas-expense'
                  label='gasto en gas'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  }}
                  type='number'
                  variant='standard'
                  {...register('gasBill', {
                    min: { value: 0, message: 'no seamos negativos' },
                    max: { value: 100_000, message: 'demasiado grande' },
                  })}
                  error={errors.gasBill && true}
                  helperText={errors.gasBill?.message}
                />
              </Grid>

              <Grid item xs={7} sm={7}>
                <FormControl style={{ minWidth: 260 }}>
                  <InputLabel id='select-gas-duration' style={{ marginLeft: 0 }}>
                    cuanto dura balón 15kg
                  </InputLabel>
                  <Select
                    labelId='id-select-gas-duration'
                    id='select-gas-duration'
                    variant='standard'
                    disabled={disableB}
                    {...register('gasDuration')}
                  >
                    <MenuItem value={undefined}>
                      <em>sin respuesta</em>
                    </MenuItem>
                    <MenuItem value={0}>uso gas de cañería</MenuItem>
                    <MenuItem value={7}>7 días o menos</MenuItem>
                    <MenuItem value={15}>15 días</MenuItem>
                    <MenuItem value={30}>1 mes</MenuItem>
                    <MenuItem value={45}>1 mes y medio</MenuItem>
                    <MenuItem value={60}>2 meses o más</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant='body2' color='primary'>
                  resiliencia energética
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={12}>
              <FormControl style={{ minWidth: 180, marginRight: 8 }}>
                <InputLabel id='id-energy-cut' style={{ marginLeft: 0 }}>
                  🔌 cortes por año
                </InputLabel>
                <Select
                  labelId='id-energy-cut'
                  id='energy-cut'
                  variant='standard'
                  disabled={disableB}
                  {...register('energy_cut', {})}
                >
                  <MenuItem value={undefined}>
                    <em>sin respuesta</em>
                  </MenuItem>
                  <MenuItem value={0}>ninguno</MenuItem>
                  <MenuItem value={1}>al menos 1</MenuItem>
                  <MenuItem value={2}>al menos 2</MenuItem>
                  <MenuItem value={3}>3 o más</MenuItem>
                </Select>
              </FormControl>

              <FormControl style={{ minWidth: 250 }}>
                <InputLabel id='label-emergency-contact'>
                  ☎️ contacto en caso de corte
                </InputLabel>
                <Select
                  labelId='label-emergency-contact'
                  id='emergency-contact'
                  variant='standard'
                  disabled={disableB}
                  {...register('emergency_contact', {})}
                >
                  <MenuItem value={undefined}>
                    <em>a nadie</em>
                  </MenuItem>
                  <MenuItem value={'City'}>al municipio</MenuItem>
                  <MenuItem value={'Company'}>a la compañía eléctrica</MenuItem>
                  <MenuItem value={'SEC'}>a la SEC</MenuItem>
                  <MenuItem value={'Mine'}>al Ministerio de Energía</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={12} style={{ marginTop: '2rem' }}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>¿vivo en zona de riesgo?</FormLabel>
                {controlGroup('risk_zone.tsunami', 'zona de tsunami')}
                {controlGroup('risk_zone.riverside', 'zona de inundación rio o canal')}
                {controlGroup('risk_zone.forest', 'zona incendios forestales')}
                {controlGroup('risk_zone.landslide', 'zona de derrumbes o aluviones')}
                <FormHelperText>
                  zona de riesgo {Object.values(form.watch('risk_zone') || {})}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={12} style={{ marginTop: '2rem' }}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>¿ha sufrido daños graves?</FormLabel>
                {controlGroup('damage_experience.rain', 'por lluvias')}
                {controlGroup('damage_experience.fire', 'por incendio')}
                {controlGroup('damage_experience.flood', 'por inundación')}
                {controlGroup('damage_experience.landslide', 'por derrumbes o aluvión')}
                {controlGroup('damage_experience.wind', 'por vientos muy fuertes')}
                <FormHelperText>
                  daños experimentados {JSON.stringify(form.watch())}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
