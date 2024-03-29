import { useEffect } from 'react'
import { object, string, type InferType } from 'yup'
import { Form, Field } from 'react-final-form'
import TextField from '@mui/material/TextField'
import { Button, AuthForm } from '../Signup/SignupForm'

import { useAppDispatch, useAppSelector } from '../../../hooks/react-redux'
import { creators as actionCreators } from '../../../store/actions/auth'
import selectorsAuth from '../../../store/selectors/auth'
import { validate } from '../../../utils'

const schema = object({
  identifier: string()
    .trim()
    .required('user name is required')
    .min(2, 'user name must be at least 2 characters')
    .max(300, "user name can't be greater than 300 characters"),
  password: string().trim().required().min(8).max(300),
})

interface SigninValues extends InferType<typeof schema> {}

export default function Signin() {
  const dispatch = useAppDispatch()
  const error = useAppSelector(state => selectorsAuth.selectErrorSignin(state))

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(actionCreators.storeUnsetErrorSignin())
      }
    }
  }, [error, dispatch])

  const submitCb = (values: SigninValues) => {
    dispatch(actionCreators.sagaSignin(values))
  }

  return (
    <Form
      onSubmit={submitCb}
      initialValues={{
        identifier: '',
        password: '',
      }}
      validate={async values => validate(schema, values)}
      render={({ handleSubmit }) => {
        return (
          <AuthForm onSubmit={handleSubmit}>
            <Field
              name="identifier"
              render={({ input, meta }) => {
                return (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Username or Email"
                    placeholder={'ed@mail'}
                    name={input.name}
                    value={input.value}
                    error={
                      typeof error !== 'string' &&
                      (!!error?.errors?.identifier || (meta.touched && !!meta.error))
                    }
                    helperText={
                      error?.errors?.identifier?.message || (meta.touched && meta.error) || null
                    }
                    onChange={ev => {
                      if (error) {
                        dispatch(actionCreators.storeUnsetErrorSignin())
                      }

                      input.onChange(ev)
                    }}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                  />
                )
              }}
            />
            <Field
              name="password"
              render={({ input, meta }) => {
                return (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Password"
                    type="password"
                    name={input.name}
                    value={input.value}
                    error={!!error?.errors?.password || (meta.touched && !!meta.error)}
                    helperText={
                      error?.errors?.password?.message || (meta.touched && meta.error) || null
                    }
                    onChange={ev => {
                      if (error) {
                        dispatch(actionCreators.storeUnsetErrorSignin())
                      }

                      input.onChange(ev)
                    }}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                  />
                )
              }}
            />

            <Button type="submit" variant="contained">
              sign in
            </Button>
          </AuthForm>
        )
      }}
    ></Form>
  )
}
