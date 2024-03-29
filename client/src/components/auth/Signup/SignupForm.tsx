import { useEffect } from 'react'
import { object, string, type InferType } from 'yup'
import { Form, Field } from 'react-final-form'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { useAppDispatch, useAppSelector } from '../../../hooks/react-redux'
import { creators as actionCreators } from '../../../store/actions/auth'
import selectorsAuth from '../../../store/selectors/auth'
import { validate } from '../../../utils'

const schema = object({
  userName: string().trim().required().min(2).max(300),
  email: string().trim().required().email(),
  firstName: string().trim().required().min(2).max(300),
  lastName: string().trim().required().min(2).max(300),
  password: string().trim().required().min(8).max(300),
})

interface SignupValues extends InferType<typeof schema> {}

export default function Signup() {
  const dispatch = useAppDispatch()
  const error = useAppSelector(state => selectorsAuth.selectErrorSignup(state))

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(actionCreators.storeUnsetErrorSignup())
      }
    }
  }, [error, dispatch])

  const submitCb = (values: SignupValues) => {
    dispatch(actionCreators.sagaSignup(values))
  }

  return (
    <Form
      onSubmit={submitCb}
      validate={values => validate(schema, values)}
      render={({ handleSubmit }) => {
        return (
          <AuthForm onSubmit={handleSubmit}>
            <Field
              name="userName"
              render={({ input, meta }) => {
                return (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Username"
                    placeholder={'Ed'}
                    name={input.name}
                    value={input.value}
                    error={!!error?.errors?.userName || (meta.touched && !!meta.error)}
                    helperText={
                      error?.errors?.userName?.message || (meta.touched && meta.error) || null
                    }
                    onChange={ev => {
                      if (error) {
                        dispatch(actionCreators.storeUnsetErrorSignup())
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
              name="email"
              render={({ input, meta }) => {
                return (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Email"
                    placeholder={'ed@mail'}
                    name={input.name}
                    value={input.value}
                    error={!!error?.errors?.email || (meta.touched && !!meta.error)}
                    helperText={
                      error?.errors?.email?.message || (meta.touched && meta.error) || null
                    }
                    onChange={ev => {
                      if (error) {
                        dispatch(actionCreators.storeUnsetErrorSignup())
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
              name="firstName"
              render={({ input, meta }) => {
                return (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="First Name"
                    placeholder={'Ed'}
                    name={input.name}
                    value={input.value}
                    error={!!error?.errors?.firstName || (meta.touched && !!meta.error)}
                    helperText={
                      error?.errors?.firstName?.message || (meta.touched && meta.error) || null
                    }
                    onChange={ev => {
                      if (error) {
                        dispatch(actionCreators.storeUnsetErrorSignup())
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
              name="lastName"
              render={({ input, meta }) => {
                return (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Last Name"
                    placeholder={'Edmonton'}
                    name={input.name}
                    value={input.value}
                    error={!!error?.errors?.lastName || (meta.touched && !!meta.error)}
                    helperText={
                      error?.errors?.lastName?.message || (meta.touched && meta.error) || null
                    }
                    onChange={ev => {
                      if (error) {
                        dispatch(actionCreators.storeUnsetErrorSignup())
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
                        dispatch(actionCreators.storeUnsetErrorSignup())
                      }

                      input.onChange(ev)
                    }}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                  />
                )
              }}
            />

            <ButtonStyled type="submit" variant="contained">
              sign up
            </ButtonStyled>
          </AuthForm>
        )
      }}
    />
  )
}

const ButtonStyled = styled(Button)`
  margin-top: 18px;
`

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  margin-bottom: 18px;
`

export { ButtonStyled as Button, AuthForm }
