import { Box, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { isRol as rolChecker } from '../../Functions/isRol';
import { IPerson } from '../../Models/Person.Interface';

export const Validation = () => {
  //State Hooks
  const [disableA, setDisableA] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>();

  const titleMessage = (
    <React.Fragment>
      <Typography variant='h5' color='primary'>
        Valide su participación ✍
      </Typography>
      <Typography variant='body1' color='textSecondary'>
        en esta sección solicitaremos su firma digital
      </Typography>
    </React.Fragment>
  );

  type Input = {
    rut: string;
  };

  //form A ✅✅
  const onSubmitA: SubmitHandler<Input> = async (data: Input) => {
    console.log('form A validation', true, data.rut);

    //fetch suscriptions
    const check = await checkSuscription(data);
  };

  async function checkSuscription(data: Input) {
    try {
      //search in Suscribed collection 🔥🔥🔥
      const queryDocs = await db
        .collection(`Activity/${refUuid}/Suscribed`)
        .where('rut', '==', data.rut)
        .get();

      const suscriptions = queryDocs.docs.map((doc) => {
        const it = doc.data();
        const person: IPerson = it as IPerson;
        return person;
      });

      console.log('detected suscriptions', suscriptions.length);
    } catch (error) {
      console.log('error in validation', error);
    }
  }

  const validationA = (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmitA)}>
        <Paper elevation={2}>
          <Box p={1}>
            <Grid
              container
              direction='row'
              spacing={2}
              justify='space-between'
              alignItems='center'
            >
              <Grid item xs={3}>
                <Typography variant='subtitle2' color='primary'>
                  Verificador
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  id='check-rut'
                  label={errors?.rut && true ? 'rut inválido 🙈' : 'ingrese su rut'}
                  type='text'
                  variant='outlined'
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
              </Grid>

              <Grid item xs={3}>
                <Button
                  type='submit'
                  variant='outlined'
                  color='primary'
                  disabled={disableA}
                >
                  {disableA ? '✅' : 'Check'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                {/*response alert 📞*/}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </form>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {titleMessage}
      <br />
      {validationA}
    </React.Fragment>
  );
};
