import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, Paper } from '@material-ui/core';
import { TextField, Grid, Button } from '@material-ui/core';

import { SubmitHandler, useForm } from 'react-hook-form';
import { isRol as rolChecker } from '../../Functions/isRol';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IConsolidated } from '../../Models/Consolidated.interface';
import { dateLimit } from '../../Config/credential';
import { Requirements } from './Suscription.requirements';
import { Alert } from '@material-ui/lab';

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

  //form step
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

    //is everything ok the must be done🆗👌
    //setStepAisDisable(true);
  };

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

  const stepBform = <React.Fragment></React.Fragment>;

  //SUSCRIPTION APP
  return (
    <React.Fragment>
      {titleMessage}
      <br />
      {stepAform}
      <br />
      <Requirements />
    </React.Fragment>
  );
};
