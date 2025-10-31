import {
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
} from '@material-ui/core';
import React from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { IRoom } from '../../Models/Classroom.interface';
import { Context } from './Context/context';
import { useForm } from 'react-hook-form';

const UpdateClassroom = (props: any) => {
  //passed uuid by react-router-dom
  let { uuid } = useParams<{ uuid: string }>();
  //fetching data from context
  const { rooms } = React.useContext(Context);
  const room: IRoom | undefined = rooms[rooms.findIndex((it) => it.uuid === uuid)];
  //useForm
  const {
    register,
    handleSubmit,
    //watch,
    //reset,
    formState: { errors },
  } = useForm<TInputForm>();

  //set form inputs init state
  const initInput: Partial<TInputForm> = {
    //room
    placeName: room?.placeActivity?.name,
    placeDir: room?.placeActivity?.dir,
    placeDate: room?.placeActivity?.date,
    //delivery
    postName: room?.placeDispatch?.name,
    postDir: room?.placeDispatch?.dir,
    postDate: room?.placeDispatch?.date,
    //deploy
    vacancies: room?.vacancies ?? 0,
  };
  const [inputData, setInputData] = React.useState<Partial<TInputForm>>(initInput);

  //on Input OnChange🔃
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(`working: ${e.target.name}:${e.target.value}`);
    //update de los props onChange en la medida que se escriben
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    //duplicate data postDir and placeDir
    if (e.target.name === 'placeName') {
      setInputData({ ...inputData, placeName: e.target.value, postName: e.target.value });
    }
    if (e.target.name === 'placeDir') {
      setInputData({ ...inputData, placeDir: e.target.value, postDir: e.target.value });
    }
  }
  //on update onSubmit
  function onSubmit() {
    console.log('on submit');
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
        <Paper
          elevation={2}
          style={{
            padding: '1rem',
            marginTop: '1rem',
            color: 'gray',
            fontFamily: 'Roboto',
            fontSize: '0.9rem',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='subtitle1' color='primary'>
                editar actividad
              </Typography>
            </Grid>
            {/**
             * Place activity
             */}

            <Grid item xs={12} sm={12}>
              <Chip
                style={{ fontSize: '.9rem' }}
                avatar={<Avatar>{(props.workDone as boolean) ? '✓' : '✏️'}</Avatar>}
                label={room.idCal.slice(1)}
                color={props.workDone ? 'primary' : 'default'}
              />{' '}
              <Typography variant='caption' color='textSecondary'>
                <span style={{ fontWeight: 'bold', color: '#3f51b5', fontSize: '1rem' }}>
                  {room.land.name}
                </span>{' '}
                ({room.land.type})
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper variant='outlined' style={{ padding: '10px 5px' }}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography variant='caption' color='primary'>
                      actividad
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {/*lugar / zoom actividad🔰📌*/}
                    <TextField
                      required
                      id='activity-place-name'
                      type='text'
                      label='establecimiento'
                      defaultValue={room.placeActivity.name}
                      variant='outlined'
                      inputProps={{ style: { textTransform: 'capitalize' } }}
                      fullWidth
                      {...register('placeName', {})}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/*dirección o url*/}
                    <TextField
                      required
                      id='activity-place-dir'
                      type='text'
                      label='dirección'
                      variant='outlined'
                      defaultValue={room.placeActivity.dir}
                      inputProps={{ style: { textTransform: 'capitalize' } }}
                      fullWidth
                      {...register('placeDir', {})}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/*date picker 📆📅📆*/}
                    <TextField
                      id='activity-date-picker'
                      type='datetime-local'
                      label='fecha/hora taller'
                      variant='outlined'
                      color='primary'
                      value={inputData.placeDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      {...register('placeDate')}
                      error={errors.placeDate && true}
                      helperText={errors.placeDate && true ? 'en el pasado?' : undefined}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                variant='outlined'
                style={{ padding: '10px 5px', backgroundColor: '#3f51b513' }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='caption' color='primary'>
                      🚚 lugar de entrega
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {/*lugar🔰📌*/}
                    <TextField
                      required
                      id='dispatch-place-name'
                      type='text'
                      label='lugar entrega'
                      variant='outlined'
                      fullWidth
                      defaultValue={room.placeDispatch?.name}
                      focused={inputData.postName ? true : undefined}
                      value={inputData.postName}
                      inputProps={{ style: { textTransform: 'capitalize' } }}
                      {...register('postName', {})}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/*address 🗺🦝🗾*/}
                    <TextField
                      required
                      id='dispatch-place-dir'
                      type='text'
                      label={'dir. despacho'}
                      variant='outlined'
                      fullWidth
                      defaultValue={room.placeDispatch?.dir}
                      focused={inputData.postDir ? true : undefined}
                      value={inputData.postDir}
                      inputProps={{ style: { textTransform: 'capitalize' } }}
                      {...register('postDir', {})}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/*date delivery Picker 📆📅*/}
                    <TextField
                      id='dispatch-place-date'
                      type='datetime-local'
                      label='fecha/hora despacho'
                      variant='outlined'
                      color='primary'
                      value={inputData.postDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      {...register('postDate', {
                        validate: { lessThan: (v: Date) => v >= inputData.placeDate! },
                      })}
                      onChange={handleInputChange}
                      error={errors.postDate && true}
                      helperText={
                        errors.postDate && true ? 'entrega temprana' : undefined
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type='number'
                      variant='filled'
                      id='vacancies'
                      label='cupos'
                      inputProps={{ min: 1, max: 300, step: 1 }}
                      defaultValue={room.vacancies ?? 0}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
              {/**
               * Dispatch place
               */}
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' color='primary' type='submit'>
                modificar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default withRouter(UpdateClassroom);

type TInputForm = {
  //place class 📌
  placeName: string;
  placeDir: string;
  placeDate: Date;
  //place delivery🚚
  postName: string;
  postDir: string;
  postDate: Date;
  //post
  vacancies: number;
};
