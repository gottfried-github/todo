import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
    error: null,
    errorSignup: null,
    errorSignin: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    unsetToken: state => {
      state.token = ''
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    unsetError: state => {
      state.error = null
    },
    setErrorSignup: (state, action) => {
      state.errorSignup = action.payload
    },
    unsetErrorSignup: state => {
      state.errorSignup = null
    },
    setErrorSignin: (state, action) => {
      state.errorSignin = action.payload
    },
    unsetErrorSignin: state => {
      state.errorSignin = null
    },
  },
  selectors: {
    selectToken: state => state.token,
    selectError: state => state.error,
    selectErrorSignup: state => state.errorSignup,
    selectErrorSignin: state => state.errorSignin,
  },
})

export default slice