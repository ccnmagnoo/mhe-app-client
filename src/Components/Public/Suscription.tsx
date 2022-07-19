import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, LinearProgress, Paper, TextFieldProps } from '@material-ui/core';
import {
  TextField,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import moment from 'moment';
import 'moment/locale/es'; // Pasar a español

import { SubmitHandler, useForm } from 'react-hook-form';
import { isRol as rolChecker, RolRequest } from '../../Functions/isRol';

import { Requirements } from './Suscription.requirements';
import { Alert, Autocomplete } from '@material-ui/lab';
import { cities } from '../../Assets/cities';
import { IRoom, iRoomConverter } from '../../Models/Classroom.interface';

//transitions
import Grow from '@material-ui/core/Grow';
import { IPerson, iPersonConverter } from '../../Models/Person.Interface';
import { getGender } from '../../Functions/getGender';
import { OnSuccessSuscription } from './Suscription.onSuccess';
import { capitalWord } from '../../Functions/capitalWord';
import { dbKey } from '../../Models/databaseKeys';
import { IBeneficiary, iBeneficiaryConverter } from '../../Models/Beneficiary.interface';
import { withRouter } from 'react-router-dom';
import isEmail from '../../Functions/isEmail';
import ClassroomCard from './Suscription.ClassroomCard';
import { orderBy, where } from 'firebase/firestore';
import driver from '../../Database/driver';
import { dateLimit } from '../../Config/credential';
import { EnergyPollForm } from './EnergyPollForm';
import { OnFailSuscription } from './Suscription.onFail';

type Props = {
  oversuscription?: boolean;
};

export type InputSuscription = {
  rut: string;
  name: string;
  fatherName: string;
  motherName: string;
  dir: string;
  city: string;
  email: string;
  phone?: string;
  //energy poll ⚡
  electricBill?: number;
  electricity?: number;
  gasBill?: number;
  gasDuration?: number;
};

const Suscription = (props: Props) => {
  //instance of oversuscription
  const oversuscription: boolean = props.oversuscription ?? false;
  //hooks
  const [rolRequest, setRolRequest] = React.useState<RolRequest | undefined>(undefined);
  const [gotBenefit, setGotBenefit] = React.useState<boolean | undefined>(undefined);

  //objects states
  const [avaliableClassrooms, setAvaliableClassrooms] = React.useState<IRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<IRoom | undefined>(undefined);
  const [suscribedPerson] = React.useState<IPerson | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  //form is disabled
  const [disableA, setDisableA] = React.useState(false);
  const [disableB, setDisableB] = React.useState(false);
  const [disableC, setDisableC] = React.useState(false);
  const [disableS, setDisableS] = React.useState(true); /*final submit button*/
  //hooks or form is visible
  const [visibleB, setVisibleB] = React.useState(false);
  const [visibleC, setVisibleC] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  //progressing bar state
  const [progressA, setProgressA] = React.useState(false);
  const [progressB, setProgressB] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    reset,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watch,
    formState: { errors },
  } = useForm<InputSuscription>();

  //function move to bottom of the page⏬
  //TODO:search function

  //Return stactic content
  const header = (
    <React.Fragment>
      <Typography variant='h6' color='primary'>
        {oversuscription ? (
          <span>Inscripción forzada</span>
        ) : (
          <span>Inscripción a talleres</span>
        )}
      </Typography>
      <Typography variant='body1' color='initial'>
        {oversuscription ? (
          <span>inscripción hasta 120 días después del taller</span>
        ) : (
          <span>recuerde tener su carnet a mano 🙌💳</span>
        )}
      </Typography>
    </React.Fragment>
  );

  //FORM A 💖💖💗
  const onSubmitA: SubmitHandler<InputSuscription> = async (data) => {
    //init
    console.log('register', 'step A', true);
    console.log('submit A', data);
    setProgressA(true); //progress bar ON

    //checking rut 👁‍🗨
    const rolVerified = rolChecker(data.rut);
    setRolRequest(rolVerified);

    console.log('is rol valid?', rolVerified.rol);

    //check is already got kit 👁‍🗨👁‍🗨 on firebase🔥🔥🔥
    const result = await checkBenefit(rolVerified);
    setGotBenefit(result); //state of having benefits active
    console.log('got benefits?', result);
  };

  //on result of onSubmitStepA
  React.useEffect(() => {
    //is everything ok the must be done🆗👌
    setProgressA(false); //progress bar OFF
    if (gotBenefit === false) {
      //on success 👌 disable RUT input
      setDisableA(true);
      //set visible second form 👁‍🗨
      setVisibleB(true);
    } else {
      setDisableA(false);
    }
  }, [gotBenefit]);

  /**
   * @function checkBenefit got is she got old active benefits
   */
  async function checkBenefit(rolRequest?: RolRequest) {
    try {
      //firestore🔥🔥🔥 fetching al RUT benefits ins register

      const benefits = (await driver.get<IBeneficiary>(
        undefined,
        'collection',
        dbKey.cvn,
        iBeneficiaryConverter,
        where('rut', '==', rolRequest?.rol),
        where('dateSign', '>=', dateLimit)
      )) as IBeneficiary[];

      //filter all benefits after date limit (now 31-01-2017)

      console.log('benefits after date limit', benefits.length);

      //true: failure, had benefits,  false:go go go, this person is ok
      return benefits.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch checker rut', error);
      return true;
    }
  }

  //alert snackbar A💥💢
  const snackbarA = () => {
    if (gotBenefit === undefined) {
      return undefined;
    } else if (gotBenefit === true) {
      //active benefits, alert cant continue ❌❌
      return (
        <Grid item xs={12}>
          <Alert severity='error'>no cumple los requisitos 🙈</Alert>
        </Grid>
      );
    } else {
      return (
        //non, active benefits , alert this person can continue ✅✅
        <Grid item xs={12}>
          <Alert severity='success'>cumple los requisitos 😃</Alert>
        </Grid>
      );
    }
  };

  const formA = (
    <>
      <Grow in={true}>
        <form onSubmit={handleSubmit(onSubmitA)}>
          <Paper elevation={2}>
            <Box p={1}>
              <Grid
                container
                direction='row'
                spacing={2}
                justify='space-evenly'
                alignItems='center'
                alignContent='flex-start'
              >
                <Grid item xs={12} sm={'auto'}>
                  <Typography variant='subtitle2' color='primary'>
                    Paso 1
                  </Typography>
                </Grid>

                <Grid item xs={8} sm={6}>
                  <TextField
                    fullWidth
                    required
                    disabled={disableA}
                    id='check-rut'
                    label={errors?.rut && true ? 'rut inválido 😗' : 'ingrese rut'}
                    type='number'
                    variant='outlined'
                    {...register('rut', {
                      pattern: {
                        value: /^\d{7,8}[-]*[Kk\d]{1}$/,
                        message: 'esto no es un rut 😗',
                      },
                      validate: { isTrue: (v) => rolChecker(v).check === true },
                    })}
                    error={errors.rut && true}
                    helperText={errors.rut?.message}
                  />

                  {rolRequest?.check}
                </Grid>

                <Grid item xs={4} sm={'auto'}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    disabled={disableA}
                  >
                    {disableA ? '✅' : 'seguir'}
                  </Button>
                </Grid>

                {/*response alert*/}
                {snackbarA() ?? (
                  // replace for K
                  <Grid item xs={12}>
                    <Alert severity='info' style={{ color: '#2196f3' }}>
                      <b>solo cifras</b>, reemplace <b>K</b> por un <b>CERO</b>.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </form>
      </Grow>
    </>
  );

  //FROM B 💖💖💗
  const onSubmitB: SubmitHandler<InputSuscription> = async (data) => {
    console.log('form B', data);
    setDisableB(true);
    setProgressB(true); //progress bar ON

    //fetch Classrooms form firebase 🔥🔥🔥
    const getClassrooms = await fetchClassrooms(data);
    console.log('getClassrooms result', getClassrooms);
    //open form C
    setVisibleB(false); //hide step2
    setVisibleC(true);
    setProgressB(false); //progress bar OFF
  };

  /**
   * @function fetchClassrooms got active incoming classrooms
   * INSIDE the territory suscription
   */
  async function fetchClassrooms(data: InputSuscription) {
    try {
      //firestore🔥🔥🔥: fetch incoming classes
      /**
       * @param backwardDays is how many days back is a classroom
       *  will keep open to suscribe in,  on cases for late suscriptions
       * if value= 0 so suscription will close at start room date.
       *
       */
      //time restriction
      console.log('requested city', data.city, '');
      const restrictionTime = new Date();
      if (oversuscription === false) {
        //normal: get last 14 days Rooms
        const backwardDays = +(process.env.REACT_APP_SUSCRIPTION_TIME_GAP ?? 14);
        restrictionTime.setDate(restrictionTime.getDate() - backwardDays);
      } else {
        //oversuscription: set init year
        restrictionTime.setDate(1);
        restrictionTime.setMonth(0);
        restrictionTime.setHours(0, 0);
      }
      //firebase
      const rooms = (await driver.get<IRoom>(
        undefined,
        'collection',
        dbKey.room,
        iRoomConverter,
        where('dateInstance', '>', restrictionTime),
        where('allowedCities', 'array-contains', data.city),
        orderBy('dateInstance', 'desc')
      )) as IRoom[];

      console.log('incoming classrooms', rooms);

      const choosableRooms: IRoom[] =
        oversuscription === false
          ? rooms.filter((room) => {
              //filtering rooms with vacancies
              const vacancies: number = room.vacancies ?? 180;
              return room.enrolled.length < vacancies;
            })
          : rooms; //full rooms;

      console.log(
        'list of avaliable classrooms on city',
        data.city,
        choosableRooms.length,
        choosableRooms.map((it) => it.idCal)
      );

      //set near classrooms avaliable state  🎣
      setAvaliableClassrooms(choosableRooms);

      return choosableRooms.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch classrooms', error);
    }
  }

  const formB = (
    <>
      <br />
      <Grow in={visibleB}>
        <Paper elevation={2}>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitB)}>
              <Grid container spacing={1} justify='flex-end'>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' color='primary'>
                    Ingrese sus datos
                  </Typography>
                </Grid>
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

                {/*Energy Poll ⚡⚡🔌*/}
                {
                  oversuscription === false ? (
                    <EnergyPollForm
                      trigger={disableB}
                      register={register}
                      errors={errors}
                    /> //show
                  ) : undefined //hide
                }

                <Grid item xs={3} sm={'auto'}>
                  <Button
                    disabled={disableB}
                    type='submit'
                    variant='outlined'
                    color='primary'
                  >
                    {disableB ? '✅' : 'seguir'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Grow>
    </>
  );

  //FORM C 💖💖💗
  const onSubmitC: SubmitHandler<InputSuscription> = async (data) => {
    console.log('form C', data);
    //init, disable "inscription button"
    setDisableC(true);
    setDisableS(true);
    setIsUploading(true);

    //load to firebase Suscribed 🔥🔥🔥
    const isUploaded = await createSuscription(data);
    console.log('is uploaded?', isUploaded);

    if (isUploaded) {
      setDialogOpen(true);
      setIsUploading(false);
    } else {
      setDisableC(false);

      setIsUploading(false);
    }
  };

  //firebase create Suscribed🔥🔥🔥
  const [errorC, setErrorC] = React.useState<{ value: boolean; message: string } | null>(
    null
  );

  async function createSuscription(data: InputSuscription) {
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

      //check rolRequest null state
      if (rolRequest?.rol === undefined) {
        console.log('check rol is ', undefined);
        setErrorC({
          value: true,
          message: 'rut mal definido 🙊 ',
        });
        return false;
      }

      //check the selected ROOM has already this RUT 🔎👤
      const suscriptions = (await driver.get(
        undefined,
        'collection',
        dbKey.sus,
        iPersonConverter,
        where('rut', '==', data.rut)
      )) as IPerson[];
      const clientSuscriptions = suscriptions.map((it) => it.classroom.uuid);

      //if indexOf is -1: this person isnt suscribed to seleced room
      const isNotSuscribed = clientSuscriptions.indexOf(selectedRoom?.uuid ?? '') === -1;
      if (isNotSuscribed) {
        //prepare to upload new suscription
        console.log('prepare to upload suscription', data.email);

        //create reference of new doc Suscribed
        const person: IPerson = {
          uuid: '',
          name: {
            firstName: capitalWord(data.name),
            fatherName: capitalWord(data.fatherName),
            motherName: capitalWord(data.motherName),
          },
          rut: rolRequest.rol,
          gender: getGender(data.name),
          classroom: {
            idCal: selectedRoom?.idCal ?? 'R000.00',
            uuid: selectedRoom?.uuid ?? 'no-data',
            dateInstance: selectedRoom?.dateInstance ?? new Date(),
          },
          dateUpdate: new Date(),
          email: data.email.toLowerCase(),
          phone: data.phone ?? null,
          address: {
            dir:
              data.dir !== undefined ? capitalWord(data.dir.toLowerCase()) : 'no-informa',
            city: data.city,
          },
          energy: {
            electricity: data.electricity === undefined ? null : +data.electricity,
            electricBill: data.electricBill === undefined ? null : +data.electricBill,
            gasDuration: data.gasDuration === undefined ? null : +data.gasDuration,
            gasBill: data.gasBill === undefined ? null : +data.gasBill,
          },
        };

        //set new suscription 🔥🔥🔥
        await driver.set(dbKey.sus, person, iPersonConverter);

        console.log('suscription success 👌', person.rut, '➡', selectedRoom?.idCal);
        setErrorC({ value: false, message: 'felicidades, ya estás participando ' });

        //set new enrolled 🔥🔥🔥 (moved to cloud functions)

        const enrolled = selectedRoom?.enrolled;
        if (enrolled !== undefined && enrolled.indexOf(person?.uuid) === -1) {
          //update classroom enrolled list is dosent exist, avoid duplication
          //enrolled?.push(person.uuid);
          //refRoom.set({ enrolled: enrolled }, { merge: true });
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
      return (
        <Grid item xs={12}>
          <Alert severity='error'>{errorC.message}</Alert>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12}>
          <Alert severity='success'>
            Inscripción existosa 💖 , recuerda <strong>no faltar</strong> al taller, es{' '}
            {moment(selectedRoom?.dateInstance).endOf('day').fromNow()}, te esperamos.
          </Alert>
        </Grid>
      );
    }
  };
  // cards of avaliables classrooms or not
  const classRoomsAvaliableDisplay = () => {
    if (avaliableClassrooms.length > 0) {
      return avaliableClassrooms.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} key={index}>
            {/*mini card with room adapter room select 👆*/}

            <ClassroomCard
              item={item}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              disableC={disableC}
              setDisableS={setDisableS}
            ></ClassroomCard>
          </Grid>
        );
      });
    } else {
      // lo sentimos
      return <OnFailSuscription />;
    }
  };

  const formC = (
    <>
      <br />
      <Grow in={visibleC}>
        <Paper>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitC)}>
              <Grid container spacing={2} justify='flex-end'>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' color='primary'>
                    Seleccione su taller <strong>{watch().name}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {/*room mini card slection*/}
                    {classRoomsAvaliableDisplay()}
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    disabled={disableC}
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
                    disabled={disableC}
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
                {/*linear progress bar*/}
                {isUploading ? (
                  <Grid item xs={12}>
                    <LinearProgress color='primary' />
                  </Grid>
                ) : undefined}

                {/*response alert*/}
                {snackbarC()}
              </Grid>
            </form>
          </Box>
        </Paper>
      </Grow>
    </>
  );

  //Dialog on success suscription
  const dialogOnSuccess = (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        reset();
      }}
      aria-labelledby='success suscription'
    >
      <DialogTitle id='index'>
        <Typography variant='subtitle1' color='primary'>
          Felicidades <strong> {suscribedPerson?.name.firstName} </strong>ya estás
          inscrit@ 🎉✨
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/*dialog content 🧁*/}
        <OnSuccessSuscription person={suscribedPerson} classroom={selectedRoom} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
          color='primary'
          variant='outlined'
        >
          Gracias nos vemos
        </Button>
      </DialogActions>
    </Dialog>
  );

  //SUSCRIPTION APP
  return (
    <React.Fragment>
      {header}
      <br />
      {formA}
      {progressA ? <LinearProgress color='primary' /> : undefined}
      {visibleB && formB}
      {progressB ? <LinearProgress color='primary' /> : undefined}
      {visibleC && formC}
      <br />
      {disableA ? undefined : oversuscription === false ? <Requirements /> : undefined}
      {dialogOnSuccess}
    </React.Fragment>
  );
};

export default withRouter<any, any>(Suscription);
