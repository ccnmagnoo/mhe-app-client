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
import { isRol as rolChecker } from '../../Functions/isRol';
import { IBeneficiary, iBeneficiaryConverter } from '../../Models/Beneficiary.interface';
import { IRoom, iRoomConverter } from '../../Models/Classroom.interface';
import { IPerson, iPersonConverter } from '../../Models/Person.Interface';
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
import { limit, orderBy, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import driver from '../../Database/driver';
import IExternal, { IExternalConverter } from '../../Models/External.interface';
import { storage } from '../../Config/firebase';
import getAllowValidation from '../../Functions/getAllowValidation';
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
  const [candidate, setCandidate] = React.useState<IPerson | undefined>(undefined);
  const [classroom, setClassroom] = React.useState<IRoom | undefined>(undefined);

  //State Hooks diable buttons
  const [disableCodeForm, set_disableCodeForm] = React.useState(false);
  const [disableIdForm, sed_disableIdForm] = React.useState(true);
  const [disableSignForm, set_disableSignForm] = React.useState(true);
  const [disableSignPad, set_disableSignPad] = React.useState(false);
  const [isUploading, set_isUploading] = React.useState(false);

  //State hooks visibility
  const [id_form_is_visible, set_id_form_is_visible] = React.useState(false);
  const [sign_form_is_visible, set_sign_form_is_visible] = React.useState(false);

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

  //canvas hook const 👩‍🎨👨‍🎨🎨
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
        Para validarse contacte a <b>coordinación</b>
      </Typography>
    </React.Fragment>
  );

  //form External user account  ✅✅
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorEU, setErrorEU] = React.useState<null | {
    value: boolean;
    message: string;
  }>(null);

  const code_snackbar = () => {
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
      console.log('subscribed result', checkAccount);
      set_disableCodeForm(true);
      sed_disableIdForm(false);
      set_id_form_is_visible(true);
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

      //firestore🔥🔥🔥 fetching al RUT benefits at register
      const storedCode = validationCode(data.ePass, validationKey);

      const key = (await driver.get<IExternal>(
        undefined,
        'collection',
        dbKey.ext,
        IExternalConverter,
        where('password', '==', storedCode),
        orderBy('expiration', 'desc'),
        limit(1)
      )) as IExternal[];

      console.log('accounts detected', key.length);

      if (key.length > 0) {
        const account = key[0]; //returning first key created;

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

  const codeValidationForm = (
    <>
      <br />
      <Grow in={true} timeout={800}>
        <form onSubmit={handleSubmit(onSubmitCredentials)}>
          <Paper elevation={2}>
            <Box p={1}>
              <Grid
                container
                spacing={2}
                alignItems='center'
                justify='space-evenly'
                direction='row'
              >
                <Grid item sm={'auto'} xs={12}>
                  <Typography variant='subtitle2' color='primary'>
                    Código
                  </Typography>
                </Grid>

                <Grid item xs={8} sm={6}>
                  <TextField
                    fullWidth
                    disabled={disableCodeForm}
                    required
                    id='input-password'
                    label='código'
                    defaultValue={validationKey}
                    type='text'
                    variant='outlined'
                    {...register('ePass', {
                      minLength: { value: 6, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.ePass && true}
                    helperText={errors.ePass?.message}
                  />
                </Grid>

                <Grid item xs={4} sm={'auto'}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    disabled={disableCodeForm}
                  >
                    {disableCodeForm ? '✅' : 'seguir'}
                  </Button>
                </Grid>
                {code_snackbar()}
              </Grid>
            </Box>
          </Paper>
        </form>
      </Grow>
    </>
  );

  //form A ✅✅
  const [errorId, set_errorId] = React.useState<null | {
    value: boolean;
    message: string;
  }>(null);

  const idValidation_snackbar = () => {
    if (errorId !== null) {
      if (errorId.value) {
        //if error true 😡❌📛
        return (
          <Grid item xs={12}>
            <Alert severity='error'>
              {errorId.message}
              <UrlChip url={classroom?.placeActivity.dir} />
            </Alert>
          </Grid>
        );
      } else {
        //if validation is success ✅
        return (
          <Grid item xs={12}>
            <Alert severity='success'>
              {errorId.message} <UrlChip url={classroom?.placeActivity.dir} />
            </Alert>
          </Grid>
        );
      }
    } else {
      return (
        <Grid item xs={12}>
          <Alert severity='info'>
            <b>solo cifras</b>, reemplace <b>K</b> por un <b>CERO</b>.
          </Alert>
        </Grid>
      );
    }
  };

  const on_submit_id: SubmitHandler<Input> = async (data: Input) => {
    console.log('form A: rut validation', true, data.rut);
    const { rol } = rolChecker(data.rut);

    //fetch subscriptions
    const checkSubscribed = await checkSubscription(rol);
    if (checkSubscribed !== undefined) {
      //disableA
      console.log('subscribed result', checkSubscribed);
      sed_disableIdForm(true);
      set_sign_form_is_visible(true);
      setCandidate(checkSubscribed);
      console.log('active B', true);
    } else {
      console.log('validation A on suspense', checkSubscribed);
    }
  };

  //Database part 🔥🔥🔥
  async function checkSubscription(rol?: string) {
    try {
      //search in subscriptions of RUT on Subscribed collection 🔥🔥🔥
      const subscriptions = (await driver.get<IPerson>(
        undefined,
        'collection',
        dbKey.sus,
        iPersonConverter,
        where('rut', '==', rol),
        orderBy('dateUpdate', 'desc')
      )) as IPerson[];

      //there's subscriptions?
      if (subscriptions.length > 0) {
        //if this human  has a valid subscription
        console.log('detected subscriptions', subscriptions.length);

        //getting last subscription in time...🚩🕜
        const lastSubscription = subscriptions[0];
        console.log('last subscription was', lastSubscription.dateUpdate);

        //check if this person already if validate&signed this subscription🔥🔥🔥
        const isConsolidated = await checkConsolidated(lastSubscription.uuid);
        if (isConsolidated !== undefined) {
          //on consolidation ID existence; return undefined and error
          console.log(' benefit is already signed', lastSubscription.uuid);
          set_errorId({
            value: true,
            message: `ya cuenta con validación ${moment(isConsolidated.dateSign)
              .startOf('h')
              .fromNow()}  🤔`,
          });
          return undefined;
        }

        const room = (await driver.get<IRoom>(
          lastSubscription.classroom.uuid,
          'doc',
          dbKey.room,
          iRoomConverter
        )) as IRoom | undefined;

        //set state of current classroom
        if (room !== undefined) {
          console.log('set classroom state', room.uuid);
          setClassroom(room);
        } else {
          console.log('i wasn"t able to fetch classroom object');
        }

        //checking if this person is on schedule ⌛🏁🏁to sign
        const now = new Date();
        const allowValidation: Date = getAllowValidation(room);

        // FIXME: some browser shows UTC wrong hours

        const countGap = process.env.REACT_APP_VALIDATION_TIME_GAP
          ? +process.env.REACT_APP_VALIDATION_TIME_GAP
          : 30; /*time validation after activity*/
        const timeGap: Date = new Date(
          lastSubscription.classroom.dateInstance.getTime()
        ); /*last moment to VALIDATE 👮‍♀️⌛*/
        timeGap.setDate(
          timeGap.getDate() + countGap
        ); /*@timegap defines how much time got for validation */

        console.log('time of class', allowValidation);
        console.log('time to sign', timeGap);

        switch (true) {
          case now > allowValidation && now < timeGap: {
            //this human being is on time 👌
            set_errorId({
              value: false,
              message: 'continue para validarse 🤗',
            });
            console.log(errorId);
            return lastSubscription;
          }
          case now < allowValidation: {
            // this bunny is running to fast, too early 🐇
            set_errorId({
              value: true,
              message: `podrás firmar en ${moment(allowValidation)
                .endOf('m')
                .fromNow()} 🤗`,
            });
            console.log(errorId);
            return undefined;
          }
          default: {
            //this turtle was not in time 🐢 🚫
            set_errorId({
              value: true,
              message: 'no llegaste a tiempo 😥, debes esperar a otro taller ',
            });
            console.log(errorId);
            return undefined;
          }
        }
      } else {
        //return error no subscription found
        console.log('no subscriptions detected', subscriptions.length);
        set_errorId({
          value: true,
          message: 'no encuentro este rut 🙊, tienes que que haberte inscrito antes',
        });
        console.log(errorId);
      }
    } catch (error) {
      console.log('error in validation', error);
      set_errorId({ value: true, message: 'no pude obtener los datos 🙈' });
    }
  }

  async function checkConsolidated(subscription: string) {
    /**
     *  @function checkConsolidated 🔥🔥🔥 return if this subscription ID
     * was already signed and validate, fetching sus ID inside Consolidated,
     * if this is not (undefined) will return FALSE , which means is ok👌🆗:
     */
    console.log('search for consolidated', subscription);

    const consolidation: IBeneficiary = (await driver.get(
      subscription,
      'doc',
      dbKey.cvn,
      iBeneficiaryConverter
    )) as IBeneficiary;

    return consolidation;
  }

  const idValidation = (
    <>
      <Grow in={id_form_is_visible} timeout={800}>
        <form onSubmit={handleSubmit(on_submit_id)}>
          <Paper elevation={2}>
            <Box p={1}>
              <Grid
                container
                direction='row'
                spacing={2}
                alignItems='center'
                justify='space-evenly'
                alignContent='flex-start'
              >
                <Grid item xs={12} sm={'auto'}>
                  <Typography variant='subtitle2' color='primary'>
                    Verificador
                  </Typography>
                </Grid>

                <Grid item xs={8} sm={6}>
                  <TextField
                    fullWidth
                    disabled={disableIdForm}
                    required
                    id='check-rut'
                    label={errors?.rut && true ? 'rut inválido 🙈' : 'rut beneficiario'}
                    type='number'
                    variant='outlined'
                    {...register('rut', {
                      pattern: {
                        value: /^\d{7,8}[-]*[Kk\d]{1}$/,
                        message: 'esto no es un rut 😗',
                      },
                      validate: {
                        isTrue: (v) => {
                          if (disableIdForm === false) {
                            return rolChecker(v).check === true;
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

                <Grid item xs={4} sm={'auto'}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    disabled={disableIdForm}
                  >
                    {disableIdForm ? '✅' : 'Seguir'}
                  </Button>
                </Grid>

                {idValidation_snackbar()}
              </Grid>
            </Box>
          </Paper>
        </form>
      </Grow>
      <br />
    </>
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
    console.log('init validation B', data);
    //init states
    set_isUploading(true); /*loading progress*/
    set_disableSignForm(true); /*on click*/

    //upload sign )SVG to storage 🔥🔥💾

    //upload IBeneficiary to Consolidated 🔥🔥🔥
    const result = await postBeneficiary();
    //setState
    set_isUploading(false); /*loading progress*/
    set_disableSignPad(result);
  };

  async function postBeneficiary() {
    //firebase init
    try {
      //format svg: getting svg in string
      const now = new Date();
      const signSvg = draw.getSvgXML();

      //new beneficiary with sign SVG code✍✍✍✒
      if (candidate !== undefined) {
        //upload signature and get string 📷🌄🚞🚵‍♂️
        const uploadSignature = await setSignToStorage(signSvg, candidate.uuid);

        //building beneficiary 💏
        const beneficiary: IBeneficiary = {
          ...candidate,
          sign: uploadSignature,
          dateSign: now,
        };

        //push sign database ⏫⏫⏫
        /*checking previous benefits*/
        const consolidation = (await driver.get(
          candidate?.uuid,
          'doc',
          dbKey.cvn,
          iBeneficiaryConverter
        )) as IBeneficiary | undefined;

        //check is this benefit was already signed
        if (consolidation === undefined) {
          //if it dosent exist, human can sign ✅ create UUID defined consolidation
          driver.set(dbKey.cvn, beneficiary, iBeneficiaryConverter, candidate.uuid, {
            merge: true,
          });
          console.log('posted beneficiary', beneficiary.uuid);

          setErrorB({
            value: false,
            message: `ya se encuentra validado 😀, pase a retirar su kit.
            📌 ${classroom?.placeDispatch?.dir} desde el ${moment(
              classroom?.placeDispatch?.date
            ).format('dddd DD [de] MMMM')}`,
          });
          return true;
        } else {
          //if benefit exist, user can not sign ⛔
          console.log('this user has previous benefit', beneficiary.uuid);
          setErrorB({
            value: true,
            message: '⛔ Este usuario no puede recibir nuevamente el beneficio.',
          });
          return false;
        }
      } else {
        //definition problem on referenced person ⛔
        console.log('error person ', undefined);
        setErrorB({ value: true, message: 'beneficiario no definido.' });
        return false;
      }
    } catch (error) {
      //error on firebase.set() method ⛔
      console.log('error on post beneficiary', error);
      setErrorB({ value: true, message: 'no se pudo cargar beneficiario 🙉.' });
      return false;
    }
  }

  async function setSignToStorage(svgString: string | null, uuid: string) {
    /**
     * this @function setSvgToStorage takes svg
     * String XLM to a blob/PGN to upload to Firebase Storage as *.png
     * or return undefined
     */

    if (svgString === null) {
      return undefined;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const canvas = new OffscreenCanvas(300, 200);
      const context = canvas?.getContext('2d');
      if (context !== null && context !== undefined) {
        //render image
        const v = Canvg.fromString(context, svgString);
        await v.render();
        const blob = await canvas.convertToBlob();

        //Firebase storage 💾🔥🔥🔥
        const thisYear = new Date().getFullYear();
        const storageRef = ref(
          storage,
          `mheServices/signStorage/${thisYear}/${uuid}.png`
        );
        try {
          const data = await uploadBytes(storageRef, blob);
          const done = getDownloadURL(data.ref);
          console.log('signature upload', done);
          return done;
        } catch (error) {
          console.log('signature upload', error);
          return undefined;
        }
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('signature upload', error);
      return undefined;
    }
  }

  const signValidation = (
    <React.Fragment>
      <Grow in={sign_form_is_visible} timeout={800}>
        <form onSubmit={handleSubmit(onSubmitB)}>
          <Paper elevation={0}>
            <Box p={1}>
              {/*the DOCUMENT 🚩📖📚*/}
              <SignDocument person={candidate as IBeneficiary} classroom={classroom} />
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
                          set_disableSignForm(false);
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
                          set_disableSignForm(true);
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
                          set_disableSignForm(true);
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
                        disabled={disableSignForm}
                        startIcon={<CheckCircleOutlineIcon />}
                      >
                        validar compromiso
                      </Button>
                      {/*summon new button to reload current page 🔃*/}
                      {disableSignPad && disableSignForm ? (
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
    <>
      {header}

      {!id_form_is_visible && codeValidationForm}

      {id_form_is_visible && idValidation}
      {sign_form_is_visible && signValidation}
      <Alert variant='filled' color='warning'>
        validación no compatible con 📵iPhone&trade;
      </Alert>
    </>
  );
};

export default withRouter(Validation);
