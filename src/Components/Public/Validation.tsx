import { Box, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { isRol as rolChecker } from '../../Functions/isRol';
import { IBeneficiary } from '../../Models/Beneficiary.interface';
import { IClassroom } from '../../Models/Classroom.interface';
import { IPerson } from '../../Models/Person.Interface';
import { SignDocument } from './SignDocument';

//canvas
import { useSvgDrawing } from 'react-hooks-svgdrawing';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Fab } from '@material-ui/core';

export const Validation = () => {
  //State hook with information
  const [person, setPerson] = React.useState<IPerson | undefined>(undefined);
  const [classroom, setClassroom] = React.useState<IClassroom | undefined>(undefined);

  //State Hooks diable buttons
  const [disableA, setDisableA] = React.useState(false);
  const [disableB, setDisableB] = React.useState(true);

  //State hooks visibility
  const [visibleB, setVisibleB] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    //reset,
    formState: { errors },
  } = useForm<Input>();

  //canvas hookconst
  const [renderRef, draw] = useSvgDrawing({
    penWidth: 3, // pen width
    penColor: 'blue', // pen color
    close: false, // Use close command for path. Default is false
    curve: true, // Use curve command for path. Default is true.
    delay: 5, // Set how many ms to draw points every.
    fill: 'none', // Set fill attribute for path. default is `none`
  });
  const Drawing = () => {
    // Drawing area will be resized to fit the rendering area
    return <div style={{ width: '100%', height: 180 }} ref={renderRef} />;
  };

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
        //if error true 😡❌📛
        return (
          <Grid item xs={12}>
            <Alert severity='error'>{errorOnA.message}</Alert>
          </Grid>
        );
      } else {
        //if validation is success ✅
        return (
          <Grid item xs={12}>
            <Alert severity='success'>{errorOnA.message}</Alert>
          </Grid>
        );
      }
    } else {
      return undefined;
    }
  };

  const onSubmitA: SubmitHandler<Input> = async (data: Input) => {
    console.log('form A validation', true, data.rut);

    //fetch suscriptions
    const checkSuscribed = await checkSuscription(data);
    if (checkSuscribed !== undefined) {
      //disableA
      console.log('suscribed result', checkSuscribed);
      setDisableA(true);
      setVisibleB(true);
      setPerson(checkSuscribed);
      console.log('active B', true);
    } else {
      console.log('validation A on suspense', checkSuscribed);
    }
  };

  //Database part 🔥🔥🔥
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
            firstName: it.name.firstName,
            fatherName: it.name.fatherName,
            motherName: it.name.motherName,
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
        //if this human  has a valid suscription
        console.log('detected suscriptions', suscriptions.length);
        //getting last suscription in time...
        const lastSus = suscriptions.reduce((prev, next) => {
          return prev.dateUpdate > next.dateUpdate ? prev : next;
        });
        console.log('last suscription was', lastSus.dateUpdate);

        //fetch date of classrooom from classRoom document 🔥
        const queryClassroom = await db
          .collection(`Activity/${refUuid}/Classroom`)
          .doc(lastSus.classroom.uuid)
          .get();
        const room = queryClassroom.data();
        //set state of current classroom
        //TODO: setCurrentClass
        if (room !== undefined) {
          const classroom: IClassroom = {
            uuid: room.uuid,
            idCal: room.idCal,
            dateInstance: room?.dateInstance.toDate(),
            enrolled: [],
            attendees: [],
            placeActivity: {
              name: room.placeActivity.name,
              date: room.placeActivity.date.toDate(),
              dir: room.placeActivity.dir,
            },
            placeDispatch: {
              name: room.placeDispatch?.name,
              date: room.placeDispatch?.date.toDate(),
              dir: room.placeDispatch?.dir,
            },
            allowedCities: room.allowedCities,
            cityOnOp: room.cityOnOp,
            colaborator: room.colaborator,
          };
          console.log('set classroom state', classroom.uuid);
          setClassroom(classroom);
        }

        //checking if this person is on schechule to sign
        const now = new Date();
        const act = room?.placeActivity.date.toDate();
        const timeGap = lastSus.classroom.dateInstance;
        const dirUrl = room?.placeActivity.dir;
        console.log('date instance', timeGap);
        timeGap.setDate(timeGap.getDate() + 3);
        console.log('time gap', timeGap);

        switch (true) {
          case now > act && now < timeGap: {
            //   //this human being is on time 👌
            setErrorOnA({
              value: false,
              message: 'estamos ok, continue para validarse 🤗',
            });
            console.log(errorOnA);
            return lastSus;
          }
          case now < act: {
            // this bunny is running to fast, too early 🐇
            setErrorOnA({
              value: true,
              message: `estás aquí, pero no nos adelantemos,el taller es ${moment(act)
                .endOf('days')
                .fromNow()} 🤗,\n 
                dirección: ${dirUrl}`,
            });
            console.log(errorOnA);
            return undefined;
          }
          default: {
            //this turtle was not in time 🐢 🚫
            setErrorOnA({
              value: true,
              message: 'no llegaste a tiempo 😥, debes esperar a otro taller ',
            });
            console.log(errorOnA);
            return undefined;
          }
        }
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
                  disabled={disableA}
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
              {snackBarA()}
            </Grid>
          </Box>
        </Paper>
      </form>
    </React.Fragment>
  );

  //form B
  const validationB = (
    <React.Fragment>
      <br />
      <form onSubmit={handleSubmit(() => {})}>
        <Paper>
          <Box p={1}>
            <SignDocument person={person as IBeneficiary} classroom={classroom} />
            <Paper variant='outlined'>
              <Grid container spacing={1} justify='center' direction='row'>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' color='primary'>
                    firme aquí ✍
                  </Typography>
                </Grid>
                {/*canvas ✍✍✍*/}
                <Grid item xs={1}></Grid>
                <Grid item xs={9}>
                  <Paper variant='outlined'>
                    <Box m={2} color='info.main'>
                      {Drawing}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={2} direction='column'>
                  <Fab
                    color='secondary'
                    aria-label='limpiar'
                    onClick={() => {
                      setDisableB(true);
                      draw.undo();
                    }}
                  >
                    {/*🔽*/}
                    <HighlightOffIcon />
                  </Fab>

                  <Fab
                    color='primary'
                    aria-label='done'
                    onClick={() => {
                      setDisableB(false);
                    }}
                  >
                    <div> </div>
                    {/*🔽*/}
                    <CheckCircleOutlineIcon />
                  </Fab>
                </Grid>

                <br />
                <br />
                <Grid item justify='center'>
                  <Fab variant='extended' color='secondary' disabled={disableB}>
                    <CheckCircleOutlineIcon />
                    firmar y validar
                  </Fab>
                </Grid>
              </Grid>
            </Paper>
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
      {visibleB ? validationB : undefined}
    </React.Fragment>
  );
};
