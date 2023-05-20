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

import { Requirements } from './Subscription/Subscription.requirements';
import { Alert, Autocomplete } from '@material-ui/lab';
import { cities } from '../../Assets/cities';
import { IRoom, iRoomConverter } from '../../Models/Classroom.interface';

//transitions
import Grow from '@material-ui/core/Grow';
import { IPerson, iPersonConverter } from '../../Models/Person.Interface';
import { getGender } from '../../Functions/getGender';
import { OnSuccessSubscription } from './Subscription/Subscription.onSuccess';
import { capitalWord } from '../../Functions/capitalWord';
import { dbKey } from '../../Models/databaseKeys';
import { IBeneficiary, iBeneficiaryConverter } from '../../Models/Beneficiary.interface';
import { withRouter } from 'react-router-dom';
import isEmail from '../../Functions/isEmail';
import ClassroomCard from './Subscription/Subscription.ClassroomCard';
import { orderBy, where } from 'firebase/firestore';
import driver from '../../Database/driver';
import { dateLimit } from '../../Config/credential';
import { EnergyPollForm } from './EnergyPollForm';
import { OnFailSubscription } from './Subscription/Subscription.onFail';

type Props = {
  overSubscription?: boolean;
};

export type InputSubscription = {
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

const Subscription = (props: Props) => {
  //hooks
  const [rolRequest, setRolRequest] = React.useState<RolRequest | undefined>(undefined);
  const [gotBenefit, setGotBenefit] = React.useState<boolean | undefined>(undefined);

  //objects states
  const [availableClassrooms, setAvailableClassrooms] = React.useState<IRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<IRoom | undefined>(undefined);
  const [subscribedPerson] = React.useState<IPerson | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  //form is disabled
  const [disable_form_rol, set_disability_form_rol] = React.useState(false);
  const [disable_form_identity, set_disability_form_identity] = React.useState(false);
  const [disable_form_select_room, set_disability_select_room] = React.useState(false);
  const [disable_final_message, set_disability_final_message] =
    React.useState(true); /*final submit button*/
  //hooks or form is visible
  const [visible_identity_form, setVisibleB] = React.useState(false);
  const [visible_select_room, setVisibleC] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  //progressing bar state
  const [loading_rol, set_loading_rol] = React.useState(false);
  const [loading_identity, set_loading_identity] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    reset,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watch,
    formState: { errors },
  } = useForm<InputSubscription>();

  //function move to bottom of the page⏬

  //Return static content
  const header = (
    <React.Fragment>
      <Typography variant='h6' color='primary'>
        {!props.overSubscription ? (
          <span>Inscripción forzada</span>
        ) : (
          <span>Inscripción a talleres</span>
        )}
      </Typography>
      <Typography variant='body1' color='initial'>
        {!props.overSubscription ? (
          <span>inscripción hasta 120 días después del taller</span>
        ) : (
          <span>recuerde tener su carnet a mano 🙌💳</span>
        )}
      </Typography>
    </React.Fragment>
  );

  //FORM A 💖💖💗
  const onSubmit_rol: SubmitHandler<InputSubscription> = async (data) => {
    //init
    console.log('register', 'step A', true);
    console.log('submit A', data);
    set_loading_rol(true); //progress bar ON

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
    set_loading_rol(false); //progress bar OFF
    if (gotBenefit === false) {
      //on success 👌 disable RUT input
      set_disability_form_rol(true);
      //set visible second form 👁‍🗨
      setVisibleB(true);
    } else {
      set_disability_form_rol(false);
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

  //alert snackbar of personal ID💥💢
  const snackbar_rol_form = () => {
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

  const form_inputId = (
    <>
      <Grow in={true}>
        <form onSubmit={handleSubmit(onSubmit_rol)}>
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
                    autoComplete='off'
                    autoFocus={!disable_form_rol}
                    required
                    disabled={disable_form_rol}
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
                    disabled={disable_form_rol}
                  >
                    {disable_form_rol ? '✅' : 'seguir'}
                  </Button>
                </Grid>

                {/*response alert*/}
                {snackbar_rol_form() ?? (
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

  //input personal data 💖💖💗
  const onSubmit_identity: SubmitHandler<InputSubscription> = async (data) => {
    console.log('form identity and location', data);
    set_disability_form_identity(true);
    set_loading_identity(true); //progress bar ON

    //fetch Classrooms form firebase 🔥🔥🔥
    const getClassrooms = await fetchClassrooms(data);
    console.log('getClassrooms result', getClassrooms);
    //open form C
    setVisibleB(false); //hide step2
    setVisibleC(true);
    set_loading_identity(false); //progress bar OFF
  };

  /**
   * @function fetchClassrooms got active incoming classrooms
   * INSIDE the territory subscription
   */
  async function fetchClassrooms(data: InputSubscription) {
    try {
      //firestore🔥🔥🔥: fetch incoming classes
      /**
       * @param backwardDays is how many days back is a classroom
       *  will keep open to susbcribe in,  on cases for late subscriptions
       * if value= 0 so subscription will close at start room date.
       *
       */
      //time restriction
      console.log('requested city', data.city, '');
      const restrictionTime = new Date();
      if (!props.overSubscription) {
        //normal: get last 14 days Rooms
        const backwardDays = +(process.env.REACT_APP_SUBSCRIPTION_TIME_GAP ?? 14);
        restrictionTime.setDate(restrictionTime.getDate() - backwardDays);
      } else {
        //oversubscription true: set init year
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

      console.log(
        'incoming classrooms',
        rooms,
        'oversubscription:',
        props.overSubscription
      );

      //filtering  available rooms by vacancies, or oversubscription su.
      const available_rooms: IRoom[] = !props.overSubscription
        ? rooms.filter((room) => {
            //filtering rooms with vacancies

            const vacancies: number = room.vacancies ?? 120;
            return room.enrolled.length <= vacancies;
          })
        : rooms; //full rooms;

      console.log(
        'list of available classrooms on city',
        data.city,
        available_rooms.length,
        available_rooms.map((it) => it.idCal)
      );

      //set near classrooms available state  🎣
      setAvailableClassrooms(available_rooms);

      return available_rooms.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch classrooms', error);
    }
  }

  const form_identity = (
    <>
      <br />
      <Grow in={visible_identity_form}>
        <Paper elevation={2}>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmit_identity)}>
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
                    autoComplete='off'
                    fullWidth
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
                    autoComplete='off'
                    disabled={disable_form_identity}
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
                    autoComplete='off'
                    disabled={disable_form_identity}
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
                    id='user_address'
                    autoComplete='off'
                    disabled={disable_form_identity}
                    fullWidth
                    label='dirección'
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
                  {/* TODO:select proper city, by levenshtein */}
                  <Autocomplete
                    id='city_address'
                    autoSelect
                    autoCorrect='true'
                    disabled={disable_form_identity}
                    options={cities}
                    getOptionLabel={(option) => {
                      return option.city;
                    }}
                    renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => {
                      return (
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
                      );
                    }}
                  />
                </Grid>

                {/*Energy Poll ⚡⚡🔌*/}
                {
                  !props.overSubscription ? (
                    <EnergyPollForm
                      trigger={disable_form_identity}
                      register={register}
                      errors={errors}
                    /> //show
                  ) : undefined //hide
                }

                <Grid item xs={3} sm={'auto'}>
                  <Button
                    disabled={disable_form_identity}
                    type='submit'
                    variant='outlined'
                    color='primary'
                  >
                    {disable_form_identity ? '✅' : 'seguir'}
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
  const onSubmitC: SubmitHandler<InputSubscription> = async (data) => {
    console.log('form C', data);
    //init, disable "inscription button"
    set_disability_select_room(true);
    set_disability_final_message(true);
    setIsUploading(true);

    //load to firebase Subscribed 🔥🔥🔥
    const isUploaded = await createSubscription(data);
    console.log('is uploaded?', isUploaded);

    if (isUploaded) {
      setDialogOpen(true);
      setIsUploading(false);
    } else {
      set_disability_select_room(false);

      setIsUploading(false);
    }
  };

  //firebase create Subscribed🔥🔥🔥
  const [errorC, setErrorC] = React.useState<{ value: boolean; message: string } | null>(
    null
  );

  async function createSubscription(data: InputSubscription) {
    try {
      //check if it's there a room selected ❓❓
      if (selectedRoom === undefined) {
        console.log("isn't a selected room", undefined);
        setErrorC({
          value: true,
          message: 'no has seleccionado un taller 🙊 ',
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

      //fetch actual RUT subscription instances
      const subscriptions = (await driver.get(
        undefined,
        'collection',
        dbKey.sus,
        iPersonConverter,
        where('rut', '==', data.rut)
      )) as IPerson[];

      //room uuid subscription check
      const isSubscribed = subscriptions.some(
        (it) => it.classroom.uuid === selectedRoom?.uuid
      );

      if (isSubscribed) {
        console.log('on previous existence on this room', selectedRoom?.idCal);
        setErrorC({
          value: true,
          message: 'tranquilidad, ya estabas a este taller 🤔 ',
        });
        return false;
      }

      if (!isSubscribed) {
        //prepare to upload new subscription
        console.log('prepare to upload subscription', data.email);

        //create reference of new doc Subscribed
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

        //set new subscription 🔥🔥🔥
        await driver.set(dbKey.sus, person, iPersonConverter);

        console.log('subscription success 👌', person.rut, '➡', selectedRoom?.idCal);
        setErrorC({ value: false, message: 'felicidades, ya estás participando ' });

        //set new enrolled 🔥🔥🔥 (moved to cloud functions)

        const enrolled = selectedRoom?.enrolled;
        if (enrolled !== undefined && enrolled.indexOf(person?.uuid) === -1) {
          //update classroom enrolled list is doesn't exist, avoid duplication
          //enrolled?.push(person.uuid);
          //refRoom.set({ enrolled: enrolled }, { merge: true });
          console.log('updated classroom enrolled', person.uuid, 'rut:', person.rut);
        }

        return true;
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
  // cards of available classrooms or not
  const classRoomsAvailableDisplay = () => {
    if (availableClassrooms.length > 0) {
      return availableClassrooms.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} key={index}>
            {/*mini card with room adapter room select 👆*/}

            <ClassroomCard
              item={item}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              disableC={disable_form_select_room}
              setDisableS={set_disability_final_message}
            ></ClassroomCard>
          </Grid>
        );
      });
    } else {
      // lo sentimos
      return <OnFailSubscription />;
    }
  };

  const form_selectRoom = (
    <>
      <br />
      <Grow in={visible_select_room}>
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
                    {classRoomsAvailableDisplay()}
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    disabled={disable_form_select_room}
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
                    disabled={disable_form_select_room}
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
                    disabled={disable_form_select_room && disable_final_message}
                  >
                    {disable_form_select_room && disable_final_message
                      ? '✅'
                      : 'Incripción'}
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

  //Dialog on success subscription
  const dialogOnSuccess = (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        reset();
      }}
      aria-labelledby='success subscription'
    >
      <DialogTitle id='index'>
        <Typography variant='subtitle1' color='primary'>
          Felicidades <strong> {subscribedPerson?.name.firstName} </strong>ya estás
          inscrit@ 🎉✨
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/*dialog content 🧁*/}
        <OnSuccessSubscription person={subscribedPerson} classroom={selectedRoom} />
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

  //SUBSCRIPTION APP
  return (
    <React.Fragment>
      {header}
      <br />
      {form_inputId}
      {loading_rol ? <LinearProgress color='primary' /> : undefined}
      {visible_identity_form && form_identity}
      {loading_identity ? <LinearProgress color='primary' /> : undefined}
      {visible_select_room && form_selectRoom}
      <br />
      {disable_form_rol ? undefined : !props.overSubscription ? (
        <Requirements />
      ) : undefined}
      {dialogOnSuccess}
    </React.Fragment>
  );
};

export default withRouter<any, any>(Subscription);
