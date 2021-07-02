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
  const [errorOnA, setErrorOnA] = React.useState<null | {
    value: boolean;
    message: string;
  }>(null);

  const snackBarA = () => {
    if (errorOnA !== null) {
      if (errorOnA.value) {
      }
    } else {
      return undefined;
    }
  };

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
        const person: IPerson = {
          uuid: it.uuid,
          name: {
            firstName: it.firstName,
            fatherName: it.fatherName,
            motherName: it.motherName,
          },
          rut: it.rut,
          classroom: {
            idCal: it.classroom.idCal,
            uuid: it.classroom.uuid,
            dateInstance: it.classroom.dateInstance.toDate(),
          },
          gender: it.gender,
          dateUpdate: it.dateUpdate.toDate(),
          email: it.email,
          phone: it.phone,
          address: { dir: it.address.dir, city: it.address.city },
        };
        return person;
      });

      //there's suscriptions?
      if (suscriptions.length > 0) {
        console.log('detected suscriptions', suscriptions.length);
        //getting last suscription in time...
        const lastSus = suscriptions.reduce((prev, next) => {
          return prev.dateUpdate > next.dateUpdate ? prev : next;
        });
        //checking if this person is on schechule to sign
        const now = new Date();
        const act = lastSus.classroom.dateInstance;
        const timeGap = lastSus.classroom.dateInstance;
        console.log('date instance', timeGap);
        timeGap.setDate(timeGap.getDate() + 3);
        console.log('time gap', timeGap);

        switch (true) {
          case now > act && now < timeGap: {
            //   //this human being is on time 👌
            setErrorOnA({ value: false, message: 'estás a tiempo, continue 🤗' });
            console.log(errorOnA);
            break;
          }
          case now < act: {
            // this bunny is running to fast, too early 🐇
            setErrorOnA({
              value: true,
              message: 'no nos adelantemos, primero el taller 🤗',
            });
            console.log(errorOnA);
            break;
          }
          default: {
            //this turtle is not in time 🐢 🚫
            setErrorOnA({ value: true, message: 'no llegaste a tiempo 😥 ' });
            console.log(errorOnA);
            break;
          }
        }

        /*if (now < timeGap) {
          //this human being is on time 👌 but

          setErrorOnA({ value: false, message: 'estás a tiempo, continue 🤗' });
          console.log(errorOnA);
        } else {
          //this turtle is not in time 🚫
          setErrorOnA({ value: true, message: 'no llegaste a tiempo 😥 ' });
          console.log(errorOnA);
        }
      */
      } else {
        //return error no suscription found
        console.log('no suscriptions detected', suscriptions.length);
        setErrorOnA({
          value: true,
          message: 'no encuentro inscripciones con este rut 🙊',
        });
        console.log(errorOnA);
      }
    } catch (error) {
      console.log('error in validation', error);
      setErrorOnA({ value: true, message: 'no pude obtener los datos 🙈' });
      console.log(errorOnA);
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
