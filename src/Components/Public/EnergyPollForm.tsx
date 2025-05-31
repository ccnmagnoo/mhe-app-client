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
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form';
import { InputSubscription as IS } from '../../Models/SubscriptionData';
import Checkbox from '@material-ui/core/Checkbox';

type Props<T extends FieldValues> = {
  trigger: boolean;
  form: UseFormReturn<T>;
  errors: DeepMap<T, FieldError>;
};

export const EnergyPollForm = (props: Props<IS>) => {
  const { trigger: disableB, form, errors } = props;
  const { register } = form;

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
                  ⚡ Encuesta de sus consumos energéticos
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    paragraph
                    align='justify'
                  >
                    Esta encuesta es opcional, pero contestando nos ayudas a mejorar
                    nuestros programas✨.
                  </Typography>
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
                <FormControl style={{ minWidth: 200 }}>
                  <InputLabel id='select-gas-duration' style={{ marginLeft: 0 }}>
                    cuanto dura balón 15kg
                  </InputLabel>
                  <Select
                    labelId='id-select-gas-duration'
                    id='select-gas-duration'
                    variant='standard'
                    disabled={disableB}
                    {...register('gasDuration', {})}
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

            <Grid item xs={5} sm={5}>
              <FormControl style={{ minWidth: 180, margin: 0, border: '2px solid red' }}>
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
            </Grid>
            <Grid item xs={7} sm={7}>
              <FormControl style={{ minWidth: 250 }}>
                <InputLabel id='label-emergency-contact' style={{ marginLeft: 0 }}>
                  ☎️en caso de corte contacto
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
            <Grid item>
              <FormControlLabel
                value={true}
                style={{
                  color: '#888',
                  margin: '8px 0',
                  // border: 'solid 1px #555',
                  // borderRadius: '40px',
                  padding: '0px 16px',
                }}
                control={<Checkbox color='primary' {...register('risk_zone')} />}
                label='vivo en zona de riesgo'
                labelPlacement='start'
              />
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
