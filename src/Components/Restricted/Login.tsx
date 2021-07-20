import {
  Card,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Container,
  Grow,
} from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import { SubmitHandler, useForm } from 'react-hook-form';

const Login = (props: any) => {
  const [input, setInput] = React.useState<Input>({ email: '', password: '' }); //inputs of login
  const [error, setError] = React.useState<string | null>(null); //on error login
  const [isLogin, setIsLogin] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Input> = (data, e) => {
    e?.preventDefault();
    console.log('login', data);
    setInput(data);
    setError(null);
    e?.target.reset();
    setIsLogin(true);
    reset();
  };

  const login = React.useCallback(async () => {
    setIsLogin(false);
    try {
      const res = await auth.signInWithEmailAndPassword(input.email, input.password);
      console.log('authentication', true, res.user);
      //clean 🧹💨
      setInput({ email: '', password: '' });
      //set Dashboard
      props.history.push('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Usuario no existe 😣');
      }
      if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta 😐');
      }
      console.log('authentication', false, error.code, error.message);
    }
  }, [input.email, input.password, props.history]);

  if (isLogin) {
    login();
  }

  return (
    <React.Fragment>
      <Container maxWidth='xs'>
        <Grow in={true}>
          <Card>
            <Box p={2}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={1}
                  direction='column'
                  justify='center'
                  alignItems='center'
                  alignContent='center'
                  wrap='nowrap'
                >
                  <Grid item xs={12}>
                    <Typography variant='h6' color='primary'>
                      acceso admin
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      id='email'
                      type='email'
                      label='email'
                      variant='filled'
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
                  <Grid item xs={12}>
                    <TextField
                      required
                      id='password'
                      type='password'
                      label='password'
                      variant='filled'
                      {...register('password')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant='contained' color='primary' type='submit'>
                      Ingresar
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' color='initial'>
                      {error}
                      {error !== null ? '🔔' : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Card>
        </Grow>
      </Container>
    </React.Fragment>
  );
};

export default withRouter(Login);

type Input = {
  email: string;
  password: string;
};
