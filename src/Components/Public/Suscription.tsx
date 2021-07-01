import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, Paper, TextFieldProps } from '@material-ui/core';
import { TextField, Grid, Button } from '@material-ui/core';

import { SubmitHandler, useForm } from 'react-hook-form';
import { isRol as rolChecker } from '../../Functions/isRol';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IConsolidated } from '../../Models/Consolidated.interface';
import { dateLimit } from '../../Config/credential';
import { Requirements } from './Suscription.requirements';
import { Alert, Autocomplete } from '@material-ui/lab';

//transitions
import Grow from '@material-ui/core/Grow';
import { cities } from '../../Assets/cities';

export const Suscription = () => {
  //hooks
  const [stepAisDisable, setStepAisDisable] = React.useState(false);
  const [isRol, setIsRol] = React.useState<boolean | null>(null);
  const [gotBenefit, setGotBenefit] = React.useState<boolean | undefined>(undefined);
  //hooks or form is visible
  const [stepB, setStepB] = React.useState(false);
  const [stepC, setStepC] = React.useState(false);
  const [stepD, setStepD] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Input>();

  type Input = {
    rut: string;
    documentNumber: string;
    name: string;
    fatherName: string;
    motherName: string;
    dir: string;
    city: string;
    email: string;
    phone: string;
  };

  //Return stactic content
  const titleMessage = (
    <React.Fragment>
      <Typography variant='h5' color='primary'>
        aquí puedes inscribirte al taller
      </Typography>
      <Typography variant='body1' color='initial'>
        recuerde tener su carnet💳 a mano 🙌{' '}
      </Typography>
    </React.Fragment>
  );

  //FORM A 💖💖💗

  const onSubmitStepA: SubmitHandler<Input> = async (data) => {
    console.log('register', 'step A', true);
    console.log('submit A', data);

    //checking rut 👁‍🗨👁‍🗨
    setIsRol(rolChecker(data.rut));
    console.log('is rol valid?', isRol);

    //check is already got kit 👁‍🗨👁‍🗨
    const result = await checkBenefitOnDataBase(data);
    setGotBenefit(result);
    console.log('got benefits?', result);
  };

  //on result of onSubmitStepA
  React.useEffect(() => {
    //is everything ok the must be done🆗👌
    if (gotBenefit === false) {
      //on success 👌 disable RUT input
      setStepAisDisable(true);
      //set visible second form 👁‍🗨
      setStepB(true);
    } else {
      setStepAisDisable(false);
    }
  }, [gotBenefit]);

  async function checkBenefitOnDataBase(data: Input) {
    /**
     * @function checkFirebase got is she got old active benefits
     */
    try {
      //firestore🔥🔥🔥

      const req = db.collection(`Activity/${refUuid}/Consolidated`);
      console.log('firestore fetch rut', data.rut);

      const queryDocs = await req.where('rut', '==', data.rut).get();
      console.log('test', queryDocs.docs);

      const listDocs: IConsolidated[] = queryDocs.docs.map((doc) => {
        const it = doc.data();
        return {
          uuid: doc.id,
          idCal: it.idCal,
          classroomUuid: it.classroomUuid,
          dateBenefit: it.dateBenefit.toDate(),
          rut: it.rut,
          sign: it.sign,
        };
      });

      listDocs.filter((cvn) => {
        return cvn.dateBenefit > dateLimit;
      });

      console.log('benefits after date limit', listDocs.length);

      return listDocs.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch checker rut', error);
    }
  }

  //ALERT SNACK BAR💥💢
  const stepAlert = () => {
    if (gotBenefit === undefined) {
      return undefined;
    } else if (gotBenefit === true) {
      //if condition true means this person already has valid benefits active
      return <Alert severity='error'>no cumple los requisitos 🙈</Alert>;
    } else {
      return <Alert severity='success'>cumple los requisitos 😃</Alert>;
    }
  };

  const stepAform = (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmitStepA)}>
        <Paper elevation={2}>
          <Box p={1}>
            <Grid
              container
              direction='row'
              spacing={1}
              justify='space-between'
              alignItems='center'
            >
              <Grid item xs={3}>
                <Typography variant='subtitle2' color='primary'>
                  Paso 1
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  disabled={stepAisDisable}
                  id='check-rut'
                  label={errors?.rut && true ? 'rut inválido 🙈' : 'ingrese su rut'}
                  type='text'
                  variant='filled'
                  {...register('rut', {
                    pattern: {
                      value: /^\d{7,8}[-]{1}[Kk\d]{1}$/,
                      message: 'rut inválido: sin puntos 🙅‍♂️, con guión 👌',
                    },
                    validate: { isTrue: (v) => rolChecker(v) === true },
                  })}
                  error={errors.rut && true}
                  helperText={errors.rut?.message}
                />
                {isRol}
              </Grid>

              <Grid item xs={2}>
                <Button
                  type='submit'
                  variant='outlined'
                  color='primary'
                  disabled={stepAisDisable}
                >
                  {stepAisDisable ? '✅' : 'Check'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                {/*response alert*/}
                {stepAlert()}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </form>
    </React.Fragment>
  );

  //FROM B 💖💖💗

  const onSubmitStepB: SubmitHandler<Input> = async (data) => {
    console.log('form B', data);
  };

  const stepBform = (
    <React.Fragment>
      <br />
      <Grow in={stepB}>
        <Paper elevation={2}>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitStepB)}>
              <Grid container spacing={1}>
                <Grid item sm={4}>
                  <Typography variant='subtitle2' color='primary'>
                    Paso 2
                  </Typography>
                </Grid>
                <Grid item sm={8}>
                  <TextField
                    required
                    fullWidth
                    id='document-number'
                    label='número de documento o serie'
                    type='text'
                    variant='filled'
                    {...register('documentNumber', {
                      pattern: {
                        value: /\w*\d{3}[.]?\d{3}[.]?\d{3,4}/,
                        message: 'esto parace un error',
                      },
                    })}
                    error={errors.documentNumber && true}
                    helperText={errors.documentNumber?.message}
                  />
                </Grid>
                <Grid item sm={4}>
                  {/*nombres: 👨‍🦳👩‍🦳👨‍🦰👩‍🦰👩‍🦱👨‍🦱*/}
                  <TextField
                    required
                    id='name-field'
                    label='nombre(s)'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='filled'
                    {...register('name', {
                      minLength: { value: 3, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.name && true}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid item sm={4}>
                  <TextField
                    required
                    id='name-field'
                    label='paterno'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='filled'
                    {...register('fatherName', {
                      minLength: { value: 3, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.fatherName && true}
                    helperText={errors.fatherName?.message}
                  />
                </Grid>
                <Grid item sm={4}>
                  <TextField
                    required
                    id='name-field'
                    label='materno'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='filled'
                    {...register('motherName', {
                      minLength: { value: 3, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.motherName && true}
                    helperText={errors.motherName?.message}
                  />
                </Grid>
                <Grid item sm={6}>
                  {/*dirección: 🌐🗺🚗*/}
                  <TextField
                    id='name-field'
                    fullWidth
                    label='dirección o sector'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='filled'
                    {...register('dir', {
                      maxLength: { value: 50, message: 'muy largo' },
                    })}
                    error={errors.dir && true}
                    helperText={errors.dir?.message}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={cities}
                    getOptionLabel={(option) => option.city}
                    {...register('city', {})}
                    renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                      <TextField
                        {...params}
                        required
                        label='territorio'
                        variant='filled'
                        type='text'
                        error={errors.city && true}
                        helperText={errors.city && true ? 'nombre requerido' : undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={4}>
                  <Button type='submit' variant='contained' color='primary'>
                    ingresar datos
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Grow>
    </React.Fragment>
  );

  //SUSCRIPTION APP
  return (
    <React.Fragment>
      {titleMessage}
      <br />
      {stepAform}
      {stepB ? stepBform : undefined}
      <br />
      <Requirements />
    </React.Fragment>
  );
};
