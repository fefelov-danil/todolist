import React from 'react'
import s from 'features/auth/Login.module.css'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {ErrorSnackbar} from "common/errorSnackbar";
import {authAsyncActions} from "features/auth/auth-reducer";
import {useAppDispatch} from "utils/redux-utils";

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {

  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {}

      if (!values.email) {
        errors.email = 'required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'required'
      } else if (values.password.length < 3) {
        errors.password = 'Пароль должен быть длиннее 2х символов';
      }

      return errors
    },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(authAsyncActions.loginTC(values))
      if (authAsyncActions.loginTC.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload.fieldsErrors[0]
          formikHelpers.setFieldError(error.field, error.error)
        }
      }
    },
  });

  return (
    <div className={s.login}>
      <ErrorSnackbar/>
      <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
          <FormControl>
            <FormLabel>
              <h1>Login</h1>
              <p className={s.descForLogin}>To log in get registered
                <a href={'https://social-network.samuraijs.com/'}
                   target={'_blank'}> <span>here</span>
                </a><br/>
                or use common test account credentials:< br/>
                Email: free@samuraijs.com< br/>
                Password: free</p>
            </FormLabel>
            <form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <TextField
                  label="Email"
                  margin="normal"
                  {...formik.getFieldProps('email')}/>
                {formik.touched.email && formik.errors.email &&
                    <div style={{color: 'red'}}>{formik.errors.email}</div>}
                <TextField
                  type="password"
                  label="Password"
                  margin="normal"
                  {...formik.getFieldProps('password')}/>
                {formik.touched.password && formik.errors.password &&
                    <div style={{color: 'red'}}>{formik.errors.password}</div>}
                <FormControlLabel label={'Remember me'} control={
                  <Checkbox
                    checked={formik.values.rememberMe}
                    {...formik.getFieldProps('rememberMe')}/>
                }/>
                <Button type={'submit'} variant={'contained'} color={'primary'}>
                  Login
                </Button>
              </FormGroup>
            </form>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  )
}