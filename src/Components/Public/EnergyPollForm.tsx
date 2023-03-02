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
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form';
import { InputSubscription as In } from './Subscription';

type Props<T extends FieldValues> = {
  trigger: boolean;
  register: UseFormRegister<T>;
  errors: DeepMap<T, FieldError>;
};

export const EnergyPollForm = (props: Props<In>) => {
  const { trigger: disableB, register, errors } = props;
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
                    esto es opcional, puedes contestar todo, parcialmente o nada, es sólo
                    para conocerle mejor y mejorar nuestras charlas, porque el
                    conocimiento es oro✨.
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={5} sm={5}>
                <TextField
                  disabled={disableB}
                  fullWidth
                  id='name-field'
                  label='electricidad mes'
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
                <TextField
                  disabled={disableB}
                  fullWidth
                  id='name-field'
                  label='kiloWatt-horas'
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
                <TextField
                  disabled={disableB}
                  fullWidth
                  id='gas-expense'
                  label='gasto en Gas'
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
                <FormControl style={{ minWidth: 180 }}>
                  <InputLabel id='select-gas-duration' style={{ marginLeft: 0 }}>
                    Duración Balón 15kg
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
                    <MenuItem value={7}>1 semana o ➖</MenuItem>
                    <MenuItem value={15}>2 semanas</MenuItem>
                    <MenuItem value={30}>1 mes</MenuItem>
                    <MenuItem value={45}>1 mes y medio</MenuItem>
                    <MenuItem value={60}>2 meses o ➕</MenuItem>
                    <MenuItem value={30}>uso balón chico</MenuItem>
                    <MenuItem value={30}>uso gas de red ⛽</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
