import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Typography,
  Grow,
  ButtonGroup,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import 'moment/locale/es'; // Pasar a español
import { SubmitHandler, useForm } from 'react-hook-form';
import { refUuid } from '../../Config/credential';
import { db, storage } from '../../Config/firebase';
import { isRol as rolChecker } from '../../Functions/isRol';
import { IBeneficiary } from '../../Models/Beneficiary.interface';
import { IClassroom, iClassroomConverter } from '../../Models/Classroom.interface';
import { IPerson } from '../../Models/Person.Interface';
import { SignDocument } from './SignDocument';
import { UrlChip } from './UrlChip';

//icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ReplayIcon from '@material-ui/icons/Replay';

//canvas
import { useSvgDrawing } from 'react-hooks-svgdrawing';
import Canvg from 'canvg';
import { dbKey } from '../../Models/databaseKeys';
import { LinearProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

//sign paper style
const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#e8eaf6',
  },
}));
//

const Validation = (props: any) => {
  //type input form values
  //local storage o code💾
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validationKey, setValidationKey] = React.useState<null | string>(
    sessionStorage.getItem('validationCode')
  );

  const signPaper = useStyles();
  //State hook with information
  const [person, setPerson] = React.useState<IPerson | undefined>(undefined);
  const [classroom, setClassroom] = React.useState<IClassroom | undefined>(undefined);

  //State Hooks diable buttons
  const [disableEU, setDisableEU] = React.useState(false);
  const [disableA, setDisableA] = React.useState(true);
  const [disableB, setDisableB] = React.useState(true);
  const [disableSignPad, setDisableSignPad] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  //State hooks visibility
  const [visibleA, setVisibleA] = React.useState(false);
  const [visibleB, setVisibleB] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reset,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watch,
  } = useForm<Input>();

  type Input = {
    eUser: string;
    ePass: string;
    rut: string;
  };

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

  const header = (
    <React.Fragment>
      <Typography variant='h6' color='primary'>
        Valide su participación ✍
      </Typography>
      <Typography variant='body1' color='textSecondary'>
        en esta sección solicitaremos su firma digital, solo para servicios
      </Typography>
    </React.Fragment>
  );

  //form External user account  ✅✅
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorEU, setErrorEU] = React.useState<null | {
    value: boolean;
    message: string;
  }>(null);

  const snackbarEU = () => {
    //check public account
    if (errorEU !== null) {
      if (errorEU.value) {
        //if error true 😡❌📛
        return (
          <Grid item xs={12}>
            <Alert severity='error'>{errorEU.message}</Alert>
          </Grid>
        );
      } else {
        //if validation is success ✅
        return (
          <Grid item xs={12}>
            <Alert severity='success'>{errorEU.message}</Alert>
          </Grid>
        );
      }
    } else {
      return undefined;
    }
  };

  const onSubmitCredentials: SubmitHandler<Input> = async (data, e) => {
    //init on submit
    console.log('form External User', true, data.eUser);

    //fetch account credentials on firebase🔥🔥🔥
    const checkAccount = await checkInputCode(data);
    if (checkAccount === true) {
      //disableA
      console.log('suscribed result', checkAccount);
      setDisableEU(true);
      setDisableA(false);
      setVisibleA(true);
      console.log('active user', true);
    } else {
      console.log('check external account on suspense', checkAccount);
    }
  };

  const checkInputCode = async (data: Input) => {
    console.log('checking external user:', data.eUser);
    try {
      //use local storage
      const validationCode = (
        inputCode: string | undefined,
        storedCode: string | null | undefined
      ) => {
        if (inputCode !== undefined) {
          return inputCode;
        } else if (storedCode != null) {
          return storedCode;
        } else {
          return null;
        }
      };

      //firestore🔥🔥🔥 fetching al RUT benefits ins register
      const ref = db
        .collection(`${dbKey.act}/${dbKey.uid}/${dbKey.ext}`)
        .where('password', '==', validationCode(data.ePass, validationKey));
      const snapshots = await ref.get();
      const accounts = snapshots.docs.map((snapshot) => {
        const it = snapshot.data();
        return {
          user: it.username as string,
          pass: it.password as string,
          expiration: it.expiration.toDate() as Date,
        };
      });
      console.log('accounts detected', accounts.length);
      if (accounts.length > 0) {
        const account = accounts[0];
        const rightNow = new Date();
        if (rightNow <= account.expiration) {
          //great success very nice 👍
          setErrorEU({ value: false, message: 'código verificado 😀' });
          //set local storage validationKey if null 💾
          if (data.ePass !== undefined) {
            sessionStorage.setItem('validationCode', data.ePass);
          }
          return true;
        } else {
          setErrorEU({ value: true, message: 'código expirado ⏳' });
          return false;
        }
      } else {
        //i cant find any account with this username
        setErrorEU({ value: true, message: 'no hay cuentas activas 🛑' });
        return false;
      }
    } catch (error) {
      //im having some problems with conection
      console.log('checking external user', error);
      setErrorEU({ value: true, message: 'error de conexión 🧠' });
      return false;
    }
  };

  const validationExternalUser = (
    <React.Fragment>
      <Grow in={true}>
        <form onSubmit={handleSubmit(onSubmitCredentials)}>
          <Paper elevation={2}>
            <Box p={1}>
              <Grid
                container
                spacing={2}
                alignItems='center'
                justify='space-between'
                direction='row'
              >
                <Grid item sm={3} xs={3}>
                  <Typography variant='subtitle2' color='primary'>
                    Código
                  </Typography>
                </Grid>

                <Grid item sm={6} xs={6}>
                  <TextField
                    disabled={disableEU}
                    required
                    id='input-password'
                    label='código'
                    defaultValue={validationKey}
                    type='password'
                    variant='outlined'
                    {...register('ePass', {
                      minLength: { value: 6, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.ePass && true}
                    helperText={errors.ePass?.message}
                  />
                </Grid>

                <Grid item xs={3} sm={'auto'}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    disabled={disableEU}
                  >
                    {disableEU ? '✅' : 'Check'}
                  </Button>
                </Grid>
                {snackbarEU()}
              </Grid>
            </Box>
          </Paper>
        </form>
      </Grow>
    </React.Fragment>
  );

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
              {errorA.message}
              <UrlChip url={classroom?.placeActivity.dir} />
            </Alert>
          </Grid>
        );
      } else {
        //if validation is success ✅
        return (
          <Grid item xs={12}>
            <Alert severity='success'>
              {errorA.message} <UrlChip url={classroom?.placeActivity.dir} />
            </Alert>
          </Grid>
        );
      }
    } else {
      return undefined;
    }
  };

  const onSubmitA: SubmitHandler<Input> = async (data: Input) => {
    console.log('form A: rut validation', true, data.rut);

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
          .collection(`${dbKey.act}/${dbKey.uid}/${dbKey.room}`)
          .withConverter(iClassroomConverter)
          .doc(lastSus.classroom.uuid)
          .get();
        const room = queryClassroom.data();

        //set state of current classroom
        if (room !== undefined) {
          console.log('set classroom state', room.uuid);
          setClassroom(room);
        }

        //checking if this person is on schechule ⌛🏁🏁to sign
        const now = new Date();
        const act: Date = room?.placeActivity.date ?? new Date(); /*day of class 📆*/
        //some browser shows UTC wrong hours
        act.setHours(act.getHours() - 6);
        const timeGap: Date =
          lastSus.classroom.dateInstance; /*last moment to VALIDATE 👮‍♀️⌛*/
        timeGap.setDate(timeGap.getDate() + 60);

        console.log('time of class', act);
        console.log('time to sign', timeGap);

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
              message: `estás en el registro,el taller es ${moment(act)
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
      <Grow in={visibleA}>
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
                    label={errors?.rut && true ? 'rut inválido 🙈' : 'rut beneficiario'}
                    type='text'
                    variant='outlined'
                    {...register('rut', {
                      //pattern: {
                      //value: /^\d{7,8}[-]{1}[Kk\d]{1}$/,
                      //message:
                      //'rut inválido 🙅‍♂️: debe tener guión "-" y estár sin puntos "." 👌',
                      //},
                      validate: {
                        isTrue: (v) => {
                          if (disableA === false) {
                            return rolChecker(v) === true;
                          } else {
                            return true;
                          }
                        },
                      },
                    })}
                    error={errors.rut && true}
                    helperText={errors.rut !== undefined ? 'rut inválido' : undefined}
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
      <br />
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
    //init states
    setIsUploading(true); /*loading progress*/
    setDisableB(true); /*on click*/

    //upload sign )SVG to storage 🔥🔥💾

    //upload IBeneficiary to Consolidated 🔥🔥🔥
    const result = await postBeneficiary();
    //setState
    setIsUploading(false); /*loading progress*/
    setDisableSignPad(result);
  };

  async function postBeneficiary() {
    //firebase init
    try {
      //format svg: getting svg in string
      const now = new Date();
      const signSvg = draw.getSvgXML();

      //new beneficiary with sign SVG code✍✍✍✒
      if (person !== undefined) {
        //upload signature and get string 📷🌄🚞🚵‍♂️
        const uploadSignature = await setSvgToStorage(signSvg, person.uuid);

        //building beneficiary 💏
        const beneficiary: IBeneficiary = {
          ...person,
          sign: uploadSignature,
          dateSign: now,
        };

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

          //set attendees on classroom list 🔥🔥🔥 (moved to cloud functions)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const refRoom = db
            .collection(`${dbKey.act}/${dbKey.uid}/Classroom`)
            .doc(classroom?.uuid);
          const attendees = classroom?.attendees;

          if (attendees !== undefined && attendees.indexOf(beneficiary?.uuid) === -1) {
            //attendees?.push(person.uuid);
            //refRoom.set({ attendees: attendees }, { merge: true });
            console.log('updated classroom attendees', beneficiary?.uuid);
          }

          //set errors false
          setErrorB({
            value: false,
            message: `ya se encuentra validado 😀, no olvide retirar su kit 
            📌 ${classroom?.placeDispatch?.dir} desde el ${moment(
              classroom?.placeDispatch?.date
            ).format('dddd DD [de] MMMM')}`,
          });
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

  async function setSvgToStorage(svgString: string | null, uuid: string) {
    /**
     * this @function setSvgToStorage takes svg
     * String XLM to a blob/PGN to upload to Firebase Storage as *.png
     * or return undefined
     */

    if (svgString === null) {
      return undefined;
    }
    try {
      const canvas = new OffscreenCanvas(300, 200);
      const context = canvas?.getContext('2d');
      if (context !== null && context !== undefined) {
        //render image
        const v = Canvg.fromString(context, svgString);
        await v.render();
        const blob = await canvas.convertToBlob();

        //Firebase storage 💾🔥🔥🔥
        const thisYear = new Date().getFullYear();
        const storageRef = storage.ref();
        const signRef = storageRef.child(
          `mheServices/signStorage/${thisYear}/${uuid}.png`
        );
        const snapshot = await signRef.put(blob);
        const done: string = await snapshot.ref.getDownloadURL();
        console.log('signature upload', done);

        return done;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('signature upload', error);
      return undefined;
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
                    <Typography variant='subtitle2' color='primary' align='center'>
                      firme aquí ✍ {moment(new Date()).format('dddd DD MMMM YYYY')}
                    </Typography>
                  </Grid>

                  {/*canvas control 🆓🆓✅*/}

                  <Grid item xs={'auto'} sm={'auto'} justify='center'>
                    <ButtonGroup
                      variant='contained'
                      color='inherit'
                      aria-label='control-firma'
                      size='medium'
                    >
                      <Button
                        disabled={disableSignPad}
                        color='primary'
                        aria-label='done'
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => {
                          setDisableB(false);
                        }}
                      >
                        {/*🔽*/}
                        seguir
                      </Button>

                      <Button
                        disabled={disableSignPad}
                        color='primary'
                        aria-label='back-signpad'
                        startIcon={<ReplayIcon />}
                        onClick={() => {
                          setDisableB(true);
                          draw.undo();
                        }}
                      >
                        {/*🔽*/}
                        atrás
                      </Button>
                      <Button
                        disabled={disableSignPad}
                        color='secondary'
                        aria-label='erase-signpad'
                        startIcon={<HighlightOffIcon />}
                        onClick={() => {
                          setDisableB(true);
                          draw.clear();
                        }}
                      >
                        {/*🔽*/}
                        borrar
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

                  <Grid item xs={'auto'} sm={'auto'} justify='center'>
                    <ButtonGroup variant='outlined' color='secondary' aria-label=''>
                      <Button
                        variant='contained'
                        type='submit'
                        size='large'
                        color='secondary'
                        disabled={disableB}
                        startIcon={<CheckCircleOutlineIcon />}
                      >
                        validar compromiso
                      </Button>
                      {/*summon new button to reload current page 🔃*/}
                      {disableSignPad && disableB ? (
                        <Button
                          onClick={() => {
                            //props.history.push('/suscription');
                            window.location.reload();
                          }}
                        >
                          otra firma
                        </Button>
                      ) : undefined}
                    </ButtonGroup>
                  </Grid>
                  {isUploading ? (
                    <Grid item xs={12}>
                      <LinearProgress color='primary' />
                    </Grid>
                  ) : undefined}

                  {snackbarC()}
                </Grid>
              </Paper>
            </Box>
          </Paper>
        </form>
      </Grow>
      <br />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {header}
      <br />
      {validationExternalUser}
      <br />
      {visibleA ? validationA : undefined}
      {visibleB ? validationB : undefined}
      <Alert variant='filled' color='warning'>
        validación no compatible con 📵iPhone&trade;
      </Alert>
    </React.Fragment>
  );
};

export default withRouter(Validation);
