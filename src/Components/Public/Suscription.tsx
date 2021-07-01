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
import { refUuid } from '../../Config/credential';
import { db } from '../../Config/firebase';
import { IConsolidated } from '../../Models/Consolidated.interface';
import { dateLimit } from '../../Config/credential';
import { Requirements } from './Suscription.requirements';
import { Alert, Autocomplete } from '@material-ui/lab';
import { cities } from '../../Assets/cities';
import { IClassroom } from '../../Models/Classroom.interface';

//icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

//transitions
import Grow from '@material-ui/core/Grow';
import { IPerson } from '../../Models/Person.Interface';
import { getGender } from '../../Functions/getGender';

export const Suscription = () => {
  //hooks
  const [isRol, setIsRol] = React.useState<boolean | null>(null);
  const [gotBenefit, setGotBenefit] = React.useState<boolean | undefined>(undefined);
  const [suscribed, setSuscribed] = React.useState<boolean | undefined>(undefined);
  const [avaliableClassrooms, setAvaliableClassrooms] = React.useState<IClassroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = React.useState<
    IClassroom | undefined
  >(undefined);

  //form is disabled
  const [stepAisDisable, setStepAisDisable] = React.useState(false);
  const [stepBisDisable, setStepBisDisable] = React.useState(false);
  const [stepCisDisable, setStepCisDisable] = React.useState(false);
  //hooks or form is visible
  const [stepB, setStepB] = React.useState(false);
  const [stepC, setStepC] = React.useState(false);
  const [stepD, setStepD] = React.useState(false);

  //React hook form
  const {
    register,
    handleSubmit,
    watch,
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
      <Typography variant='h5' color='primary'>
        Inscripción a Con Buena Energía
      </Typography>
      <Typography variant='body1' color='initial'>
        recuerde tener su carnet💳 a mano 🙌
      </Typography>
    </React.Fragment>
  );

  //FORM A 💖💖💗

  const onSubmitStepA: SubmitHandler<Input> = async (data) => {
    console.log('register', 'step A', true);
    console.log('submit A', data);

    //checking rut 👁‍🗨👁‍🗨
    setIsRol(rolChecker(data.rut));
    console.log('is rol valid?', isRol);

    //check is already got kit 👁‍🗨👁‍🗨
    const result = await checkBenefitOnDataBase(data);
    setGotBenefit(result);
    console.log('got benefits?', result);
  };

  //on result of onSubmitStepA
  React.useEffect(() => {
    //is everything ok the must be done🆗👌
    if (gotBenefit === false) {
      //on success 👌 disable RUT input
      setStepAisDisable(true);
      //set visible second form 👁‍🗨
      setStepB(true);
    } else {
      setStepAisDisable(false);
    }
  }, [gotBenefit]);

  async function checkBenefitOnDataBase(data: Input) {
    /**
     * @function checkFirebase got is she got old active benefits
     */
    try {
      //firestore🔥🔥🔥

      const req = db.collection(`Activity/${refUuid}/Consolidated`);
      console.log('firestore fetch rut', data.rut);

      const queryDocs = await req.where('rut', '==', data.rut).get();
      console.log('test', queryDocs.docs);

      const listDocs: IConsolidated[] = queryDocs.docs.map((doc) => {
        const it = doc.data();
        return {
          uuid: doc.id,
          classroom: {
            idCal: it.idCal,
            uuid: it.uuid,
            dateInstance: it.dateInstance.toDate(),
          },
          dateBenefit: it.dateBenefit.toDate(),
          rut: it.rut,
          sign: it.sign,
        };
      });

      listDocs.filter((cvn) => {
        return cvn.dateBenefit > dateLimit;
      });

      console.log('benefits after date limit', listDocs.length);

      return listDocs.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch checker rut', error);
    }
  }

  //ALERT SNACK BAR💥💢
  const stepAsnackBar = () => {
    if (gotBenefit === undefined) {
      return undefined;
    } else if (gotBenefit === true) {
      //if condition true means this person already has valid benefits active
      return <Alert severity='error'>no cumple los requisitos 🙈</Alert>;
    } else {
      return <Alert severity='success'>cumple los requisitos 😃</Alert>;
    }
  };

  const stepAform = (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmitStepA)}>
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
                  disabled={stepAisDisable}
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

              <Grid item xs={2}>
                <Button
                  type='submit'
                  variant='outlined'
                  color='primary'
                  disabled={stepAisDisable}
                >
                  {stepAisDisable ? '✅' : 'Check'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                {/*response alert*/}
                {stepAsnackBar()}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </form>
    </React.Fragment>
  );

  //FROM B 💖💖💗

  const onSubmitStepB: SubmitHandler<Input> = async (data) => {
    console.log('form B', data);
    setStepBisDisable(true);

    //fetch Classrooms form firebase 🔥🔥🔥
    const getClassrooms = await fetchClassrooms(data);
    console.log('getClassrooms result', getClassrooms);
    //open form C
    setStepC(true);
  };

  async function fetchClassrooms(data: Input) {
    /**
     * @function fetchClassrooms got active incoming classrooms
     * INSIDE the territory suscription
     */
    try {
      //firestore🔥🔥🔥
      const rightNow = new Date();
      const req = db.collection(`Activity/${refUuid}/Classroom`);
      console.log('requested city', data.city);

      const queryDocs = await req.where('dateInstance', '>', rightNow).get();
      console.log('incoming classrooms', queryDocs.docs);

      const listClassrooms: IClassroom[] = queryDocs.docs.map((doc) => {
        const it = doc.data();
        const classroom: IClassroom = {
          uuid: doc.id,
          idCal: it.idCal,
          colaborator: it.colaborator,
          enrolled: [],
          attendees: [],
          dateInstance: it.dateInstance.toDate(),
          placeActivity: {
            name: it.placeActivity.name,
            dir: it.placeActivity.dir,
            date: it.placeActivity.date.toDate(),
          },

          placeDispatch: {
            name: it.placeDispatch.name,
            dir: it.placeDispatch.dir,
            date: it.placeDispatch.date.toDate(),
          },
          allowedCities: it.allowedCities,
          cityOnOp: it.cityOnOp,
        };
        return classroom;
      });

      const filterClassrooms = listClassrooms.filter((classroom) => {
        return classroom.allowedCities.indexOf(data.city) !== -1;
      });

      console.log(
        'list of avaliable classrooms on city',
        data.city,
        filterClassrooms.length,
        filterClassrooms.map((it) => it.idCal)
      );

      //set classrooms avaliable state hook
      setAvaliableClassrooms(filterClassrooms);

      return listClassrooms.length > 0 ? true : false;
    } catch (error) {
      console.log('fetch classrooms', error);
    }
  }

  const stepBform = (
    <React.Fragment>
      <br />
      <Grow in={stepB}>
        <Paper elevation={2}>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitStepB)}>
              <Grid container spacing={1} justify='flex-end'>
                <Grid item sm={4}>
                  <Typography variant='subtitle2' color='primary'>
                    Paso 2
                  </Typography>
                </Grid>
                <Grid item sm={8}>
                  <TextField
                    required
                    disabled={stepBisDisable}
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
                <Grid item sm={4}>
                  {/*nombres: 👨‍🦳👩‍🦳👨‍🦰👩‍🦰👩‍🦱👨‍🦱*/}
                  <TextField
                    required
                    disabled={stepBisDisable}
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
                <Grid item sm={4}>
                  <TextField
                    required
                    disabled={stepBisDisable}
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
                <Grid item sm={4}>
                  <TextField
                    required
                    disabled={stepBisDisable}
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
                <Grid item sm={6}>
                  {/*dirección: 🌐🗺🚗*/}
                  <TextField
                    id='name-field'
                    disabled={stepBisDisable}
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
                <Grid item sm={6}>
                  <Autocomplete
                    id='combo-box-demo'
                    disabled={stepBisDisable}
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
                <Grid item sm={2}>
                  <Button
                    disabled={stepBisDisable}
                    type='submit'
                    variant='outlined'
                    color='primary'
                  >
                    {stepBisDisable ? '✅' : 'Check'}{' '}
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
  const onSubmitStepC: SubmitHandler<Input> = async (data) => {
    console.log('form C', data);

    //load to firebase Suscribed 🔥🔥🔥
    const isUploaded = await createSuscribed(data);
    console.log('is uploaded?', isUploaded);

    if (isUploaded) {
      setStepCisDisable(true);
      setSuscribed(true);
    } else {
      //set error snack bar
      setSuscribed(false);
    }
  };

  //firebase create Suscribed
  async function createSuscribed(data: Input) {
    try {
      console.log('prepare to upload suscription', data.email);
      const ref = db.collection(`Activity/${refUuid}/Suscribed`).doc();

      const person: IPerson = {
        uuid: ref.id,
        name: {
          firstName: data.name,
          fatherName: data.fatherName,
          motherName: data.motherName,
        },
        rut: data.rut,
        gender: getGender(data.name),
        classroom: {
          idCal: selectedClassroom?.idCal ?? 'R000',
          uuid: selectedClassroom?.uuid ?? 'no-data',
          dateInstance: selectedClassroom?.dateInstance ?? new Date(),
        },
        dateUpdate: new Date(),
        email: data.email,
        phone: data.phone ?? '0',
        address: { dir: data.dir, city: data.city },
      };

      ref.set(person);

      return true;
    } catch (error) {
      console.log('no upload', error);
      return false;
    }
  }

  //alert: snack bar💥💢
  const stepCsnackBar = () => {
    if (suscribed === undefined) {
      return undefined;
    } else if (suscribed === false) {
      //if condition true means this person already has valid benefits active
      return <Alert severity='error'>error en la inscripción</Alert>;
    } else {
      return (
        <Alert severity='success'>
          Inscripción existosa 💖 , recuerda <strong>no faltar</strong> al taller, es{' '}
          {moment(selectedClassroom?.dateInstance).endOf('day').fromNow()}, te esperamos.
        </Alert>
      );
    }
  };
  //card adapter to show classrooms avaliable
  const miniCardClassroom = (params: IClassroom) => {
    return (
      <React.Fragment>
        <Card>
          <CardHeader
            avatar={<Avatar aria-label='idcal'>{params.idCal.replace('R', '')}</Avatar>}
            action={
              <IconButton aria-label='seleccionar'>
                <CheckCircleIcon
                  color={selectedClassroom?.uuid === params.uuid ? 'primary' : 'action'}
                />
              </IconButton>
            }
            title={`${params.idCal} ${params.colaborator}`}
            subheader={moment(params.dateInstance).format(
              'dddd DD MMMM YYYY [a las] h:mm a'
            )}
          />
          <CardActions>
            <Button
              size='small'
              color={selectedClassroom?.uuid === params.uuid ? 'primary' : 'default'}
              variant={selectedClassroom?.uuid === params.uuid ? 'contained' : 'outlined'}
              onClick={() => {
                console.log('selected class', params.idCal);
                setSelectedClassroom(params);
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
          <Grid item xs={6} key={index}>
            {miniCardClassroom(item)}
          </Grid>
        );
      });
    } else {
      return (
        <Grid item xs={6}>
          <Card>
            <CardHeader
              avatar={<Avatar aria-label='idcal'>?</Avatar>}
              action={
                <IconButton aria-label='seleccionar'>
                  <CheckCircleIcon color='action' />
                </IconButton>
              }
              title='Lo sentimos'
              subheader='no hay talleres cercanos disponibles'
            />
            <CardContent>
              <Typography variant='subtitle2' color='primary'>
                ¿Como puedo participar en un taller?
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Los talleres son implementados por el Ministerio de energía en
                coordinación con una
                <strong> institución municipal o servicio público</strong>, puede
                acercarse a sus oficinas sociales para solicitar un taller o escribanos a
                <strong>
                  <a href=' ccamposn@minenergia.cl'> ccamposn@minenergia.cl </a>
                </strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  };

  const stepCform = (
    <React.Fragment>
      <br />
      <Grow in={stepC}>
        <Paper>
          <Box p={1}>
            <form onSubmit={handleSubmit(onSubmitStepC)}>
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

                <Grid item xs={6}>
                  <TextField
                    required
                    disabled={stepCisDisable}
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled={stepCisDisable}
                    id='phone-text-field'
                    label='teléfono (opcional)'
                    type='phone'
                    variant='outlined'
                    {...register('phone', {})}
                    error={errors.phone && true}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    disabled={stepCisDisable}
                  >
                    {stepCisDisable ? '✅' : 'Incripción'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {/*response alert*/}
                  {stepCsnackBar()}
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
      {titleMessage}
      <br />
      {stepAform}
      {stepB ? stepBform : undefined}
      {stepC ? stepCform : undefined}
      <br />
      {stepAisDisable ? undefined : <Requirements />}
    </React.Fragment>
  );
};
