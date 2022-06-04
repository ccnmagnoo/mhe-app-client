import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Paper,
  TextFieldProps,
} from '@material-ui/core';
import {
  TextField,
  Grid,
  Button,
  Avatar,
  CardHeader,
  IconButton,
} from '@material-ui/core';

import moment from 'moment';
import 'moment/locale/es'; // Pasar a español

import { SubmitHandler, useForm } from 'react-hook-form';
import { isRol as rolChecker } from '../../Functions/isRol';
import { IBeneficiary, iBeneficiaryConverter } from '../../Models/Beneficiary.interface';
import { Alert, Autocomplete } from '@material-ui/lab';
import { cities } from '../../Assets/cities';
import { IRoom, iClassroomConverter } from '../../Models/Classroom.interface';

//icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

//transitions
import Grow from '@material-ui/core/Grow';
import { IPerson, iPersonConverter } from '../../Models/Person.Interface';
import { getGender } from '../../Functions/getGender';
import { capitalWord } from '../../Functions/capitalWord';
import { dbKey } from '../../Models/databaseKeys';
import isEmail from '../../Functions/isEmail';
import { doc, orderBy, where } from 'firebase/firestore';
import driver from '../../Database/driver';
import { db } from '../../Config/firebase';

export const Oversuscription = () => {
  //hooks
  const [isRol, setIsRol] = React.useState<boolean | null>(null);
  const [gotBenefit, setGotBenefit] = React.useState<
    'with benefits' | 'no valid benefits' | undefined
  >(undefined);

  //objects states
  const [avaliableClassrooms, setAvaliableClassrooms] = React.useState<IRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<IRoom | undefined>(undefined);

  //form is disabled
  const [disableA, setDisableA] = React.useState(false);
  const [disableB, setDisableB] = React.useState(false);
  const [disableC, setDisableC] = React.useState(false);
  const [disableS, setDisableS] = React.useState(true); /*final submit button*/
  //hooks or form is visible
  const [visibleB, setVisibleB] = React.useState(false);
  const [visibleC, setVisibleC] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>();

  type Input = {
    rut: string;
    name: string;
    fatherName: string;
    motherName: string;
    dir: string;
    city: string;
    email: string;
    phone: string;
  };

  //Return stactic content
  const header = (
    <React.Fragment>
      <Typography variant='h6' color='primary'>
        Inscripción forzada
      </Typography>
      <Typography variant='body1' color='initial'>
        verificar rut para admisibilidad
      </Typography>
    </React.Fragment>
  );

  //FORM A 💖💖💗
  const onSubmitA: SubmitHandler<Input> = async (data) => {
    console.log('register', 'step A', true);
    console.log('submit A', data);

    //checking rut 👁‍🗨👁‍🗨
    setIsRol(rolChecker(data.rut));
    console.log('is rol valid?', isRol);

    //check is already got kit 👁‍🗨👁‍🗨 on firebase🔥🔥🔥
    const result = await checkBenefit(data);
    setGotBenefit(result); //state of having benefits active
    console.log('got benefits?', result);
  };

  //on result of onSubmitStepA
  React.useEffect(() => {
    //is everything ok the must be done🆗👌
    if (gotBenefit === 'no valid benefits') {
      //on success 👌 disable RUT input
      setDisableA(true);
      //set visible second form 👁‍🗨
      setVisibleB(true);
    } else {
      setDisableA(false);
    }
  }, [gotBenefit]);

  async function checkBenefit(data: Input) {
    /**
     * @function checkFirebase got is she got old active benefits
     */

    try {
      //firestore🔥🔥🔥 fetching al RUT benefits ins register
      console.log('fetch rut old benefits', data.rut);
      const currentBenefits = (await driver.get<IBeneficiary>(
        undefined,
        'collection',
        dbKey.cvn,
        iBeneficiaryConverter,
        where('rut', '==', data.rut),
        where('dateSign', '>=', dateLimit)
      )) as IBeneficiary[];

      console.log('benefits after date limit', currentBenefits.length);

      //true: failure, had benefits,  false:go go go, this person is ok

      return currentBenefits.length > 0 ? 'with benefits' : 'no valid benefits';
    } catch (error) {
      console.log('fetch checker rut', error);
      return 'with benefits';
    }
  }

  //alert snackbar A💥💢
  const snackbarA = () => {
    if (gotBenefit === undefined) {
      return undefined;
    } else if (gotBenefit === 'with benefits') {
      //active benefits, alert cant continue ❌❌
      return (
        <Grid item xs={12}>
          {' '}
          <Alert severity='error'>ya cuenta con beneficio 🙈</Alert>
        </Grid>
      );
    } else {
      return (
        //non, active benefits , alert this person can continue ✅✅
        <Grid item xs={12}>
          <Alert severity='success'>puede seguir con la inscripción 😃</Alert>
        </Grid>
      );
    }
  };

  const formA = (
    <React.Fragment>
      <Grow in={true}>
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
                    Paso 1
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    required
                    disabled={disableA}
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
                  {isRol}
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

                {/*response alert*/}
                {snackbarA()}
              </Grid>
            </Box>
          </Paper>
        </form>
      </Grow>
    </React.Fragment>
  );

  //FROM B 💖💖💗
  const onSubmitB: SubmitHandler<Input> = async (data) => {
    console.log('form B', data);
    setDisableB(true);

    //fetch Classrooms form firebase 🔥🔥🔥
    const getClassrooms = await fetchClassrooms(data);
    console.log('getClassrooms result', getClassrooms);
    //open form C
    setVisibleC(true);
  };

  async function fetchClassrooms(data: Input) {
    /**
     * @function fetchClassrooms got active incoming classrooms
     * INSIDE the territory suscription
     */
    try {
      //firestore🔥🔥🔥: fetch las 3 passed classes
      const rightNow = new Date();
      const startPeriod = new Date(rightNow.getFullYear(), 1, 1, 0);
      console.log('requested city', data.city);

      const rooms = (await driver.get<IRoom>(
        undefined,
        'collection',
        dbKey.room,
        iClassroomConverter,
        where('dateInstance', '<=', rightNow),
        where('dateInstance', '>', startPeriod),
        where('allowedCities', 'array-contains', data.city),
        orderBy('dateInstance', 'desc')
      )) as IRoom[];

      console.log(
        'list of avaliable classrooms on city',
        data.city,
        rooms.length,
        rooms.map((it) => it.idCal)
      );

      //set near classrooms avaliable state  🎣
      setAvaliableClassrooms(rooms);

      return rooms.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch classrooms', error);
    }
  }

  const formB = (
    <React.Fragment>
      <br />
      <Grow in={visibleB}>
        <Paper elevation={2}>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitB)}>
              <Grid container spacing={1} justify='flex-end'>
                <Grid item xs={4}>
                  <Typography variant='subtitle2' color='primary'>
                    Paso 2
                  </Typography>
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={12} sm={4}>
                  {/*nombres: 👨‍🦳👩‍🦳👨‍🦰👩‍🦰👩‍🦱👨‍🦱*/}
                  <TextField
                    required
                    fullWidth
                    disabled={disableB}
                    id='name-field'
                    label='nombre(s)'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='outlined'
                    {...register('name', {
                      minLength: { value: 3, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.name && true}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    required
                    disabled={disableB}
                    id='name-field'
                    label='paterno'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='outlined'
                    {...register('fatherName', {
                      minLength: { value: 3, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.fatherName && true}
                    helperText={errors.fatherName?.message}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    required
                    disabled={disableB}
                    id='name-field'
                    label='materno'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='outlined'
                    {...register('motherName', {
                      minLength: { value: 3, message: 'muy corto' },
                      maxLength: { value: 30, message: 'muy largo' },
                    })}
                    error={errors.motherName && true}
                    helperText={errors.motherName?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  {/*dirección: 🌐🗺🚗*/}
                  <TextField
                    id='name-field'
                    disabled={disableB}
                    fullWidth
                    label='dirección o sector'
                    type='text'
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    variant='outlined'
                    {...register('dir', {
                      maxLength: { value: 50, message: 'muy largo' },
                    })}
                    error={errors.dir && true}
                    helperText={errors.dir?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    id='combo-box-demo'
                    disabled={disableB}
                    options={cities}
                    getOptionLabel={(option) => option.city}
                    renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                      <TextField
                        {...params}
                        required
                        label='comuna'
                        variant='outlined'
                        type='text'
                        {...register('city', {})}
                        error={errors.city && true}
                        helperText={errors.city && true ? 'requerido' : undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3} sm={'auto'}>
                  <Button
                    disabled={disableB}
                    type='submit'
                    variant='outlined'
                    color='primary'
                  >
                    {disableB ? '✅' : 'Check'}{' '}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Grow>
    </React.Fragment>
  );

  //FORM C 💖💖💗
  const onSubmitC: SubmitHandler<Input> = async (data) => {
    console.log('form C', data);

    //load to firebase Suscribed 🔥🔥🔥
    const isUploaded = await createSuscription(data);
    console.log('is uploaded?', isUploaded);

    if (isUploaded) {
      setDisableC(true);
      setDisableS(true);
      reset();
    }
  };

  //firebase create Suscribed🔥🔥🔥
  const [errorC, setErrorC] = React.useState<{ value: boolean; message: string } | null>(
    null
  );

  async function createSuscription(data: Input) {
    try {
      //check if it's there a room selected ❓❓
      if (selectedRoom === undefined) {
        console.log('isnt a selected room', undefined);
        setErrorC({
          value: true,
          message: 'no has selecionado un taller 🙊 ',
        });
        return false;
      }

      //get all ROOMS which this RUT is suscribed 🔎👤
      const getSuscriptions: IPerson[] = (await driver.get(
        undefined,
        'collection',
        dbKey.sus,
        iPersonConverter,
        where('rut', '==', data.rut)
      )) as IPerson[];

      //if indexOf is -1: this person isnt suscribed to seleced room
      const isNotSuscribed =
        getSuscriptions
          .map((it) => it.classroom.uuid)
          .indexOf(selectedRoom?.uuid ?? '') === -1;

      //if is not suscribed proceed to upload new suscription
      if (isNotSuscribed) {
        //prepare to upload new suscription
        console.log('prepare to upload suscription', data.email);
        //create reference of new doc Suscribed

        const ref = doc(db, '');

        const person: IPerson = {
          uuid: ref.id,
          name: {
            firstName: capitalWord(data.name),
            fatherName: capitalWord(data.fatherName),
            motherName: capitalWord(data.motherName),
          },
          rut: data.rut.toUpperCase(),
          gender: getGender(data.name),
          classroom: {
            idCal: selectedRoom?.idCal ?? 'R000',
            uuid: selectedRoom?.uuid ?? 'no-data',
            dateInstance: selectedRoom?.dateInstance ?? new Date(),
          },
          dateUpdate: new Date(),
          email: data.email.toLocaleLowerCase(),
          phone: data.phone ?? null,
          address: { dir: capitalWord(data.dir.toLowerCase()), city: data.city },
          energy: {
            electricity: null,
            electricBill: null,
            gasDuration: null,
            gasBill: null,
          },
        };
        //upload firebasedriver
        const uploadResult = driver.set(undefined, dbKey.sus, person, iPersonConverter, {
          merge: true,
        });

        //set new suscription 🔥🔥🔥

        console.log(
          'suscription upload status:',
          uploadResult,
          ' data: ',
          person.rut,
          '➡',
          selectedRoom?.idCal
        );
        setErrorC({ value: false, message: 'felicidades, ya estás participando ' });

        //set new enrolled 🔥🔥🔥
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        const enrolled = selectedRoom?.enrolled;
        if (enrolled !== undefined && enrolled.indexOf(person?.uuid) === -1) {
          console.log('updated classroom enrolled', person.uuid, 'rut:', person.rut);
        }
        return true;
      } else {
        console.log('on previous existance on this room', selectedRoom?.idCal);
        setErrorC({
          value: true,
          message: 'tranquilidad, ya estabas a este taller 🤔 ',
        });
        return false;
      }
    } catch (error) {
      console.log('no upload', error);
      return false;
    }
  }

  //alert: snack bar C💥💢
  const snackbarC = () => {
    if (errorC === null) {
      return undefined;
    } else if (errorC.value === true) {
      //if condition true means this person already has valid benefits active
      return <Alert severity='error'>{errorC.message}</Alert>;
    } else {
      return (
        <Alert severity='success'>
          Inscripción existosa 💖 , recuerda <strong>no faltar</strong> al taller, es{' '}
          {moment(selectedRoom?.dateInstance).endOf('day').fromNow()}, te esperamos.
        </Alert>
      );
    }
  };
  //card adapter to show classrooms avaliable
  const miniCardClassroom = (item: IRoom) => {
    return (
      <React.Fragment>
        <Card>
          <CardHeader
            avatar={<Avatar aria-label='idcal'>{item.idCal.replace('R', '')}</Avatar>}
            action={
              <IconButton aria-label='seleccionar'>
                <CheckCircleIcon
                  color={selectedRoom?.uuid === item.uuid ? 'primary' : 'action'}
                />
              </IconButton>
            }
            title={`${item.idCal} ${item.colaborator}`}
            subheader={moment(item.dateInstance).format(
              'dddd DD MMMM YYYY [a las] h:mm a'
            )}
          />
          <CardActions>
            <Button
              size='small'
              disabled={disableC}
              color={selectedRoom?.uuid === item.uuid ? 'primary' : 'default'}
              variant={selectedRoom?.uuid === item.uuid ? 'contained' : 'outlined'}
              onClick={() => {
                console.log('selected class', item.idCal);
                setSelectedRoom(item);
                setDisableS(false);
              }}
            >
              selecionar
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  };
  // cards of avaliables classrooms or not
  const classRoomsAvaliableDisplay = () => {
    if (avaliableClassrooms.length > 0) {
      return avaliableClassrooms.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} key={index}>
            {miniCardClassroom(item)}
          </Grid>
        );
      });
    } else {
      return (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<Avatar aria-label='idcal'>?</Avatar>}
              action={
                <IconButton aria-label='seleccionar'>
                  <CheckCircleIcon color='action' />
                </IconButton>
              }
              title='Lo sentimos'
              subheader='no hay talleres con vacantes disponibles en su zona'
            />
            <CardContent>
              <Typography variant='subtitle2' color='primary'>
                ¿Como puedo participar en un taller?
              </Typography>
              <Typography variant='body2' color='textSecondary' paragraph align='justify'>
                Los talleres son implementados por el Ministerio de energía en
                coordinación con una
                <strong> institución municipal o servicio público</strong>, puede
                acercarse a sus oficinas sociales para solicitar un taller o escribanos a{' '}
                <strong>
                  <a href='mailto:ccamposn@minenergia.cl'>este email </a>
                </strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  };

  const formC = (
    <React.Fragment>
      <br />
      <Grow in={visibleC}>
        <Paper>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitC)}>
              <Grid container spacing={2} justify='flex-end'>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' color='primary'>
                    Paso final: selecciona tu taller
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {classRoomsAvaliableDisplay()}
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id='email-text-field'
                    label={
                      errors?.email && true ? 'use email conocido ej:gmail' : 'email'
                    }
                    type='email'
                    variant='outlined'
                    {...register('email', {
                      pattern: {
                        value: /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/,
                        message: 'email inválido',
                      },
                      validate: { isTrue: (v) => isEmail(v) },
                    })}
                    error={errors.email && true}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='phone-text-field'
                    label='teléfono (opcional)'
                    type='phone'
                    variant='outlined'
                    {...register('phone', {
                      pattern: {
                        value: /\+56\d{9}/,
                        message: 'inválido, incluya +56',
                      },
                      maxLength: { value: 12, message: 'muy largo' },
                    })}
                    error={errors.phone && true}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                <Grid item xs={3} sm={'auto'}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={disableC && disableS}
                  >
                    {disableC && disableS ? '✅' : 'Incripción'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {/*response alert*/}
                  {snackbarC()}
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
      {header}
      <br />
      {formA}
      {visibleB ? formB : undefined}
      {visibleC ? formC : undefined}
      <br />
    </React.Fragment>
  );
};
function dateLimit(
  arg0: string,
  arg1: string,
  dateLimit: any
): import('@firebase/firestore').QueryConstraint {
  throw new Error('Function not implemented.');
}
