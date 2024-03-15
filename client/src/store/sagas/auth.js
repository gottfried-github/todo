import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { io } from 'socket.io-client'
import axios from '../http'
import socketSubscribe from '../socket-subscribe'

import slice from '../store/slice-auth'

import { signup as actionSignup } from '../actions/auth'
import { signin as actionSignin } from '../actions/auth'
import { signout as actionSignout } from '../actions/auth'
import { unauthorizedResponse as actionUnauthorizedResponse } from '../actions/auth'
import { tokenSet as actionTokenSet } from '../actions/auth'

let socket = null

function* signup(action) {
  try {
    const res = yield call(axios.post, '/auth/signup', action.payload)

    yield put({
      type: slice.actions.setToken.type,
      payload: res.data.accessToken,
    })

    yield put({
      type: slice.actions.setUserData.type,
      payload: res.data.user,
    })

    yield put({
      type: actionTokenSet.type,
    })
  } catch (e) {
    console.log('saga, auth, signup, axios errored, e:', e)

    yield put({
      type: slice.actions.setErrorSignup.type,
      payload: e.response?.data || 'something went wrong',
    })
  }
}

function* signin(action) {
  try {
    const res = yield call(axios.post, '/auth/signin', action.payload)

    yield put({
      type: slice.actions.setToken.type,
      payload: res.data.accessToken,
    })

    yield put({
      type: slice.actions.setUserData.type,
      payload: res.data.user,
    })

    yield put({
      type: actionTokenSet.type,
    })
  } catch (e) {
    console.log('saga, auth, signin, axios errored, e:', e)

    yield put({
      type: slice.actions.setErrorSignin.type,
      payload: e.response?.data || 'something went wrong',
    })
  }
}

function* signout() {
  try {
    yield call(axios.delete, '/auth')

    yield put({
      type: slice.actions.unsetToken.type,
    })
  } catch (e) {
    console.log('saga, signout, e:', e)
    yield put({
      type: slice.actions.setError.type,
      payload: e.response?.data || 'something went wrong',
    })
  }
}

function* authorizeSocket() {
  const token = yield select(state => slice.selectors.selectToken(state))

  if (socket?.connected) {
    return put({
      type: slice.actions.setError.type,
      payload: {
        message: 'attempted to connect to the socket server, but socket is already connected',
      },
    })
  }

  socket = yield call(io, 'ws://localhost:3000', {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  })

  yield call(socketSubscribe, socket)
}

function* disconnectSocket() {
  if (!socket || socket.disconnected) {
    return put({
      type: slice.actions.setError.type,
      payload: {
        message:
          "attempted to disconnect from the socket server, but socket doesn't exist or is already disconnected",
      },
    })
  }

  yield call(socket.disconnect.bind(socket))
}

function* handleEmptyToken() {
  const token = yield select(state => slice.selectors.selectToken(state))

  if (token) return

  try {
    yield put({
      type: slice.actions.setIsLoading.type,
      payload: true,
    })

    const res = yield call(axios.get, '/auth/refresh')

    yield put({
      type: slice.actions.setToken.type,
      payload: res.data.accessToken,
    })

    yield put({
      type: slice.actions.setUserData.type,
      payload: res.data.user,
    })

    yield put({
      type: actionTokenSet.type,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e.response?.data || 'something went wrong',
    })
  } finally {
    yield put({
      type: slice.actions.setIsLoading.type,
      payload: false,
    })
  }
}

function* auth() {
  yield takeLatest(actionSignup.type, signup)
  yield takeLatest(actionSignin.type, signin)
  yield takeLatest(actionSignout.type, signout)
  yield takeLatest(actionTokenSet.type, authorizeSocket)
  yield takeEvery(actionUnauthorizedResponse.type, disconnectSocket)

  yield handleEmptyToken()
}

export default auth
