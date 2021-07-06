import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Typography,
  Chip,
  Avatar,
  Grow,
  ButtonGroup,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import { SubmitHandler, useForm } from 'react-hook-form';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { isRol as rolChecker } from '../../Functions/isRol';
import { IBeneficiary } from '../../Models/Beneficiary.interface';
import { IClassroom } from '../../Models/Classroom.interface';
import { IPerson } from '../../Models/Person.Interface';
import { SignDocument } from './SignDocument';

//icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ReplayIcon from '@material-ui/icons/Replay';

//canvas
import { useSvgDrawing } from 'react-hooks-svgdrawing';
import { isUrl } from '../../Functions/IsURL';
import React from 'react';

//sign paper style
const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#e8eaf6',
  },
}));

export const Validation = () => {
  const signPaper = useStyles();
  //State hook with information
  const [person, setPerson] = React.useState<IPerson | undefined>(undefined);
  const [classroom, setClassroom] = React.useState<IClassroom | undefined>(undefined);

  //State Hooks diable buttons
  const [disableA, setDisableA] = React.useState(false);
  const [disableB, setDisableB] = React.useState(true);
  const [disableCtrl, setDisableCtrl] = React.useState(false);

  //State hooks visibility
  const [visibleB, setVisibleB] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    //reset,
    formState: { errors },
  } = useForm<Input>();

  //canvas hookconst 👩‍🎨👨‍🎨🎨
  const [renderRef, draw] = useSvgDrawing({
    penWidth: 2, // pen width
    penColor: 'blue', // pen color
    close: false, // Use close command for path. Default is false
    curve: true, // Use curve command for path. Default is true.
    delay: 50, // Set how many ms to draw points every.
    fill: 'none', // Set fill attribute for path. default is `none`
  });
  const Drawing = () => {
    // Drawing area will be resized to fit the rendering area
    return <div style={{ width: '100%', height: 200 }} ref={renderRef} />;
  };

  //converter function
  const converToChip = (chain?: string) => {
    //check definition
    if (chain === undefined) return undefined;
    //check if dir is url or physical
    const gmaps = 'https://www.google.com/maps?q=';
    if (isUrl(chain)) {
      return (
        <Chip
          avatar={<Avatar>Z</Avatar>}
          label='link al taller'
          href={chain}
          target='_blank'
          clickable
          color='primary'
          component='a'
        />
      );
      //return <a href={chain}> link al taller </a>;
    } else {
      return (
        <Chip
          avatar={<Avatar>D</Avatar>}
          label='click dirección'
          href={`${gmaps}${chain.replace(' ', '+')}`}
          target='_blank'
          clickable
          color='primary'
          component='a'
        />
      );
      //return <a href={`${gmaps}${chain.replace(' ', '+')}`}> dirección del taller </a>;
    }
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
  const [errorA, setErrorA] = React.useState<null | {
    value: boolean;
    message: string;
  }>(null);

  const snackbarA = () => {
    if (errorA !== null) {
      if (errorA.value) {
        //if error true 😡❌📛
        return (
          <Grid item xs={12}>
            <Alert severity='error'>
              {errorA.message} {converToChip(classroom?.placeActivity.dir)}
            </Alert>
          </Grid>
        );
      } else {
        //if validation is success ✅
        return (
          <Grid item xs={12}>
            <Alert severity='success'>
              {errorA.message} {converToChip(classroom?.placeActivity.dir)}
            </Alert>
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
      //search in suscriptions of RUT on Sucribed collection 🔥🔥🔥
      const queryDocs = await db
        .collection(`Activity/${refUuid}/Suscribed`)
        .where('rut', '==', data.rut)
        .get();

      //map [{..}] of this RUT suscriptions
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

        //getting last suscription in time...🚩🕜
        const lastSus = suscriptions.reduce((prev, next) => {
          /**
           * this @param lastSus(last suscription) will only takes
           * the LAST SUSCRIPTION 🧲 in time,
           * if this person already has a second suscription, which is not,
           * this logic will avoid other suscriptions in existance. */

          return prev.dateUpdate > next.dateUpdate ? prev : next;
        });
        console.log('last suscription was', lastSus.dateUpdate);

        //check if this person already if validate&signed this suscription🔥🔥🔥
        const isConsolidated = await checkConsolidated(lastSus.uuid);
        if (isConsolidated) {
          //on consolidation ID existance; return undefined and error
          console.log(' benefit is already signed', lastSus.uuid);
          setErrorA({ value: true, message: 'usted ya se validó previamente 🤔' });
          return undefined;
        }

        //ON success continue
        //fetch date of classroom from document 🔥🔥🔥
        const queryClassroom = await db
          .collection(`Activity/${refUuid}/Classroom`)
          .doc(lastSus.classroom.uuid)
          .get();
        const room = queryClassroom.data();

        //set state of current classroom
        if (room !== undefined) {
          const classroom: IClassroom = {
            uuid: room.uuid,
            idCal: room.idCal,
            dateInstance: room?.dateInstance.toDate(),
            enrolled: room.enrolled,
            attendees: room.attendees,
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
            land: { type: room.land.type, name: room.land.name },
          };
          console.log('set classroom state', classroom.uuid);
          setClassroom(classroom);
        }

        //checking if this person is on schechule ⌛🏁🏁to sign
        const now = new Date();
        const act = room?.placeActivity.date.toDate(); /*day of class 📆*/
        const timeGap = lastSus.classroom.dateInstance; /*last moment to VALIDATE 👮‍♀️⌛*/
        timeGap.setDate(timeGap.getDate() + 3);

        console.log('date of class', act);
        console.log('time gap', timeGap);

        switch (true) {
          case now > act && now < timeGap: {
            //this human being is on time 👌
            setErrorA({
              value: false,
              message: 'continue para validarse 🤗',
            });
            console.log(errorA);
            return lastSus;
          }
          case now < act: {
            // this bunny is running to fast, too early 🐇
            setErrorA({
              value: true,
              message: `estás en el registro, pero no nos adelantemos,el taller es ${moment(
                act
              )
                .endOf('days')
                .fromNow()} 🤗`,
            });
            console.log(errorA);
            return undefined;
          }
          default: {
            //this turtle was not in time 🐢 🚫
            setErrorA({
              value: true,
              message: 'no llegaste a tiempo 😥, debes esperar a otro taller ',
            });
            console.log(errorA);
            return undefined;
          }
        }
      } else {
        //return error no suscription found
        console.log('no suscriptions detected', suscriptions.length);
        setErrorA({
          value: true,
          message: 'no encuentro este rut 🙊, tienes que que haberte inscrito antes',
        });
        console.log(errorA);
      }
    } catch (error) {
      console.log('error in validation', error);
      setErrorA({ value: true, message: 'no pude obtener los datos 🙈' });
      console.log(errorA);
    }
  }

  async function checkConsolidated(suscription: string) {
    /**
     *  @function checkConsolidated 🔥🔥🔥 return if this suscription ID
     * was already signed and validate, fetching sus ID inside Consolidated,
     * if this is not (undefined) will return FALSE , which means is ok👌🆗:
     */
    const queryCvn = await db
      .collection(`Activity/${refUuid}/Consolidated`)
      .doc(suscription)
      .get();
    const result = queryCvn.data();
    if (result === undefined) {
      return false; /*not consolidated*/
    } else {
      return true; /* already consolidated*/
    }
  }

  const validationA = (
    <React.Fragment>
      <Grow in={true}>
        <form onSubmit={handleSubmit(onSubmitA)}>
          <Paper elevation={2}>
            <Box p={1}>
              <Grid
                container
                spacing={2}
                alignItems='center'
                justify='space-between'
                direction='row'
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
                        message:
                          'rut inválido 🙅‍♂️: debe tener guión "-" y estár sin puntos "." 👌',
                      },
                      validate: { isTrue: (v) => rolChecker(v) === true },
                    })}
                    error={errors.rut && true}
                    helperText={errors.rut?.message}
                  />
                </Grid>

                <Grid item xs={3} sm={'auto'}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    disabled={disableA}
                  >
                    {disableA ? '✅' : 'Check'}
                  </Button>
                </Grid>
                {snackbarA()}
              </Grid>
            </Box>
          </Paper>
        </form>
      </Grow>
    </React.Fragment>
  );

  //form B  ✅✅
  const [errorB, setErrorB] = React.useState<{ value: boolean; message: string } | null>(
    null
  );
  const snackbarC = () => {
    if (errorB !== null) {
      if (errorB.value) {
        //if error true 😡❌📛
        return (
          <Grid item xs={12}>
            <Alert severity='error'>{errorB.message}</Alert>
          </Grid>
        );
      } else {
        //if validation is success ✅
        return (
          <Grid item xs={12}>
            <Alert severity='success'>{errorB.message}</Alert>
          </Grid>
        );
      }
    } else {
      return undefined;
    }
  };

  const onSubmitB: SubmitHandler<Input> = async (data: Input) => {
    console.log('init valudation B', data);
    //upload sign SVG to storage 🔥🔥💾

    //upload IBeneficiary to Consolidated 🔥🔥🔥
    const result = await postBeneficiary();

    //setState
    setDisableB(result); /*on success*/
    setDisableCtrl(result);
  };

  async function postBeneficiary() {
    try {
      //format svg
      const now = new Date();
      const signSvg = draw
        .getSvgXML()
        ?.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

      //new beneficiary with sign SVG code✍✍✍✒
      if (person !== undefined) {
        const beneficiary: IBeneficiary = { ...person, sign: signSvg, dateSign: now };

        //push sign database ⏫⏫⏫
        const refDoc = db
          .collection(`Activity/${refUuid}/Consolidated`)
          .doc(person?.uuid);

        //check is this benefit was already signed
        const req = await refDoc.get();
        if (req.data() === undefined) {
          //if it dosent exist, human can sign ✅
          await refDoc.set(beneficiary);
          console.log('posted beneficiary', beneficiary.uuid);

          //set attendees on classroom list : already validated
          const refRoom = db
            .collection(`Activity/${refUuid}/Classroom`)
            .doc(classroom?.uuid);
          const attendees = classroom?.attendees;

          if (attendees !== undefined && attendees.indexOf(beneficiary?.uuid) === -1) {
            attendees?.push(person.uuid);
            refRoom.set({ attendees: attendees }, { merge: true });
            console.log('updated classroom attendees', beneficiary?.uuid);
          }

          //set errors false
          setErrorB({ value: false, message: 'beneficiario validado 😀' });
          return true;
        } else {
          //if it's exist, human can not sign ⛔
          console.log(' benefit is already signed', beneficiary.uuid);
          setErrorB({ value: true, message: 'beneficiario ya validado  🤔' });
          return false;
        }
      } else {
        //definition problem on referenced person ⛔
        console.log('error person ', undefined);
        setErrorB({ value: true, message: 'beneficiario no definido' });
        return false;
      }
    } catch (error) {
      //error on firebase.set() method ⛔
      console.log('error on post beneficiary', error);
      setErrorB({ value: true, message: 'no se pudo cargar beneficiario 🙉' });
      return false;
    }
  }

  const validationB = (
    <React.Fragment>
      <Grow in={visibleB}>
        <form onSubmit={handleSubmit(onSubmitB)}>
          <Paper elevation={0}>
            <Box p={1}>
              {/*the DOCUMENT 🚩📖📚*/}
              <SignDocument person={person as IBeneficiary} classroom={classroom} />
              <Paper variant='outlined' elevation={1}>
                <Grid
                  container
                  spacing={1}
                  justify='center'
                  direction='row'
                  alignContent='center'
                >
                  <Grid item xs={12} sm={9}>
                    <Typography variant='subtitle2' color='primary' align='left'>
                      firme aquí ✍
                    </Typography>
                  </Grid>

                  {/*canvas control 🆓🆓✅*/}

                  <Grid item xs={'auto'} sm={'auto'} justify='center'>
                    <ButtonGroup
                      variant='contained'
                      color='inherit'
                      aria-label='control-firma'
                    >
                      <Button
                        disabled={disableCtrl}
                        color='primary'
                        aria-label='done'
                        onClick={() => {
                          setDisableB(false);
                        }}
                      >
                        {/*🔽*/}
                        <CheckCircleOutlineIcon />
                      </Button>

                      <Button
                        disabled={disableCtrl}
                        color='primary'
                        aria-label='atrás'
                        onClick={() => {
                          setDisableB(true);
                          draw.undo();
                        }}
                      >
                        {/*🔽*/}
                        <ReplayIcon />
                      </Button>
                      <Button
                        disabled={disableCtrl}
                        color='secondary'
                        aria-label='borrar'
                        onClick={() => {
                          setDisableB(true);
                          draw.clear();
                        }}
                      >
                        {/*🔽*/}
                        <HighlightOffIcon />
                      </Button>
                    </ButtonGroup>
                  </Grid>

                  {/*canvas ✍✍✍*/}

                  <Grid item xs={12} sm={9}>
                    <Paper elevation={4} className={signPaper.paperRoot}>
                      <Box m={2} p={2} color='secondary'>
                        {Drawing}
                      </Box>
                    </Paper>
                  </Grid>
                  <br />
                  <Grid item xs={'auto'} sm={'auto'} justify='center'>
                    <Button
                      variant='contained'
                      type='submit'
                      color='secondary'
                      disabled={disableB}
                      startIcon={<CheckCircleOutlineIcon />}
                    >
                      firmar y validar
                    </Button>
                    <br />
                  </Grid>
                  {snackbarC()}
                </Grid>
              </Paper>
            </Box>
          </Paper>
        </form>
      </Grow>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {titleMessage}
      <br />
      {validationA}
      <br />
      {visibleB ? validationB : undefined}
    </React.Fragment>
  );
};
