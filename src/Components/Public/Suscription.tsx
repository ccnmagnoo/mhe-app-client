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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import moment from 'moment';
import 'moment/locale/es'; // Pasar a español

import { SubmitHandler, useForm } from 'react-hook-form';
import { isRol as rolChecker } from '../../Functions/isRol';
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IConsolidated } from '../../Models/Consolidated.interface';
import { dateLimit } from '../../Config/credential';
import { Requirements } from './Suscription.requirements';
import { Alert, Autocomplete } from '@material-ui/lab';
import { cities } from '../../Assets/cities';
import { IClassroom, iClassroomConverter } from '../../Models/Classroom.interface';

//icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

//transitions
import Grow from '@material-ui/core/Grow';
import { IPerson } from '../../Models/Person.Interface';
import { getGender } from '../../Functions/getGender';
import { OnSuccessSuscription } from './Suscription.onSuccess';
import { capitalWord } from '../../Functions/capitalWord';
import { LandType } from '../../Functions/GetTerritoryList';
import { dbKey } from '../../Models/databaseKeys';

export const Suscription = () => {
  //hooks
  const [isRol, setIsRol] = React.useState<boolean | null>(null);
  const [gotBenefit, setGotBenefit] = React.useState<boolean | undefined>(undefined);

  //objects states
  const [avaliableClassrooms, setAvaliableClassrooms] = React.useState<IClassroom[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<IClassroom | undefined>(
    undefined
  );
  const [suscribedPerson, setSuscribedPerson] = React.useState<IPerson | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

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
    documentNumber: string;
    name: string;
    fatherName: string;
    motherName: string;
    dir: string;
    city: string;
    email: string;
    phone: string;
  };

  //Return stactic content
  const titleMessage = (
    <React.Fragment>
      <Typography variant='h6' color='primary'>
        Inscripción a capacitaciones
      </Typography>
      <Typography variant='body1' color='initial'>
        recuerde tener su carnet a mano 🙌💳
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
    if (gotBenefit === false) {
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

      const req = db.collection(`Activity/${refUuid}/Consolidated`);
      console.log('firestore fetch rut', data.rut);
      const queryDocs = await req.where('rut', '==', data.rut).get();

      const listDocs: IConsolidated[] = queryDocs.docs.map((doc) => {
        const it = doc.data();
        const result: IConsolidated = {
          uuid: doc.id,
          classroom: {
            idCal: it.classroom.idCal,
            uuid: it.classroom.uuid,
            dateInstance: it.classroom.dateInstance.toDate(),
          },
          dateBenefit: it.dateBenefit.toDate(),
          rut: it.rut,
          sign: it.sign,
        };
        return result;
      });

      //filter all benefits after date limit (now 31-01-2017)
      const filterDocs = listDocs.filter((cvn) => {
        return cvn.dateBenefit > dateLimit;
      });
      console.log('benefits after date limit', filterDocs.length);

      //true: failure, had benefits,  false:go go go, this person is ok

      return filterDocs.length > 0 ? true : false;
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
          {' '}
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
      //firestore🔥🔥🔥: fetch incoming classes
      const rightNow = new Date();
      const fetch = db
        .collection(`${dbKey.act}/${refUuid}/${dbKey.room}`)
        .where('dateInstance', '>', rightNow)
        .withConverter(iClassroomConverter);

      console.log('requested city', data.city);

      const querySnapshot = await fetch.get();
      console.log('incoming classrooms', querySnapshot.docs);

      const roomsWithVacancies: IClassroom[] = querySnapshot.docs
        .map((doc) => {
          //get list of classrooms
          const it = doc.data();
          return it;
        })
        .filter((classroom) => {
          //filtering near classes🔎🔍📟
          return classroom.allowedCities.indexOf(data.city) !== -1;
        })
        .filter((classroom) => {
          //filtering rooms with vacancies 👩👨👶👸👨👧🙅🚫
          const vacancies: number = classroom.vacancies ?? 180;
          console.log(
            'analizing vancacies, enrolled',
            classroom.enrolled.length,
            'vacancies: ',
            vacancies
          );
          return classroom.enrolled.length < vacancies;
        });

      console.log(
        'list of avaliable classrooms on city',
        data.city,
        roomsWithVacancies.length,
        roomsWithVacancies.map((it) => it.idCal)
      );

      //set near classrooms avaliable state  🎣
      setAvaliableClassrooms(roomsWithVacancies);

      return roomsWithVacancies.length > 0 ? true : false;
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
                <Grid item xs={8}>
                  <TextField
                    required
                    disabled={disableB}
                    fullWidth
                    id='document-number'
                    label='número de documento o serie'
                    type='text'
                    variant='outlined'
                    {...register('documentNumber', {
                      pattern: {
                        value: /\w*\d{3}[.]?\d{3}[.]?\d{3,4}/,
                        message: 'esto parace un error',
                      },
                    })}
                    error={errors.documentNumber && true}
                    helperText={errors.documentNumber?.message}
                  />
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
                        label='ciudad'
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
      setDialogOpen(true);
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

      //check the selected ROOM has already this RUT 🔎👤
      const susRef = db.collection(`Activity/${refUuid}/Suscribed`);
      const susQuery = await susRef.where('rut', '==', data.rut).get();
      const susDocs = susQuery.docs.map((sus) => {
        const it = sus.data() as IPerson;
        //create array maps of Rooms ID this RUT had suscribed
        return it.classroom.uuid;
      });

      //if indexOf is -1: this person isnt suscribed to seleced room
      const isNotSuscribed = susDocs.indexOf(selectedRoom?.uuid ?? '') === -1;
      if (isNotSuscribed) {
        //prepare to upload new suscription
        console.log('prepare to upload suscription', data.email);
        //create reference of new doc Suscribed
        const ref = db.collection(`Activity/${refUuid}/Suscribed`).doc();

        const person: IPerson = {
          uuid: ref.id,
          name: {
            firstName: capitalWord(data.name),
            fatherName: capitalWord(data.fatherName),
            motherName: capitalWord(data.motherName),
          },
          rut: data.rut,
          gender: getGender(data.name),
          classroom: {
            idCal: selectedRoom?.idCal ?? 'R000',
            uuid: selectedRoom?.uuid ?? 'no-data',
            dateInstance: selectedRoom?.dateInstance ?? new Date(),
          },
          dateUpdate: new Date(),
          email: data.email,
          phone: data.phone ?? '0',
          address: { dir: capitalWord(data.dir), city: data.city },
        };

        //set new suscription 🔥🔥🔥
        await ref.set(person);
        setSuscribedPerson(person);
        console.log('suscription success 👌', person.rut, '➡', selectedRoom?.idCal);
        setErrorC({ value: false, message: 'felicidades, ya estás participando ' });

        //set new enrolled 🔥🔥🔥
        const refRoom = db
          .collection(`Activity/${refUuid}/Classroom`)
          .doc(selectedRoom?.uuid);

        const enrolled = selectedRoom?.enrolled;
        if (enrolled !== undefined && enrolled.indexOf(person?.uuid) === -1) {
          //update classroom enrolled list is dosent exist, avoid duplication
          enrolled?.push(person.uuid);
          refRoom.set({ enrolled: enrolled }, { merge: true });
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
  const miniCardClassroom = (item: IClassroom) => {
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
                    label='email'
                    type='email'
                    variant='outlined'
                    {...register('email', {
                      pattern: {
                        value: /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/,
                        message: 'email inválido',
                      },
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
                    {...register('phone', {})}
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
          Gracias nos vemos 👋
        </Button>
      </DialogActions>
    </Dialog>
  );

  //SUSCRIPTION APP
  return (
    <React.Fragment>
      {titleMessage}
      <br />
      {formA}
      {visibleB ? formB : undefined}
      {visibleC ? formC : undefined}
      <br />
      {disableA ? undefined : <Requirements />}
      {dialogOnSuccess}
    </React.Fragment>
  );
};
