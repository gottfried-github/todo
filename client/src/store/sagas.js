import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import axios from './http'

import slice from './slice'

import {
  create as actionCreate,
  updateStatus as actionUpdateStatus,
  updateName as actionUpdateName,
  deleteOne as actionDeleteOne,
  deleteDone as actionDeleteDone,
  getItems as actionGetItems,
} from './actions'

class Item {
  constructor(name) {
    this.name = name
  }
}

function* create(action) {
  const item = new Item(action.payload)

  const filter = yield select(state => slice.selectors.selectFilter({ [slice.reducerPath]: state }))

  const body = { item, sort: filter.sort }

  if (filter.status) {
    body.status = filter.status
  }

  try {
    const res = yield call(axios.post, '/todos', body)

    yield put({
      type: slice.actions.setItems.type,
      payload: res.data,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* updateStatus(action) {
  const filter = yield select(state => slice.selectors.selectFilter({ [slice.reducerPath]: state }))

  const body = {
    item: {
      status: action.payload.status,
    },
    sort: filter.sort,
  }

  if (filter.status) {
    body.status = filter.status
  }

  try {
    const res = yield call(axios.patch, `/todos/${action.payload.id}`, body)

    yield put({
      type: slice.actions.setItems.type,
      payload: res.data,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* updateName(action) {
  const filter = yield select(state => slice.selectors.selectFilter({ [slice.reducerPath]: state }))

  const body = {
    item: {
      name: action.payload.name,
    },
    sort: filter.sort,
  }

  if (filter.status) {
    body.status = filter.status
  }

  try {
    const res = yield call(axios.patch, `/todos/${action.payload.id}`, body)

    yield put({
      type: slice.actions.setItems.type,
      payload: res.data,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* deleteOne(action) {
  const filter = yield select(state => slice.selectors.selectFilter({ [slice.reducerPath]: state }))

  const body = { sort: filter.sort }

  if (filter.status) {
    body.status = filter.status
  }

  try {
    const res = yield call(axios.delete, `/todos/${action.payload}`, body)

    yield put({
      type: slice.actions.setItems.type,
      payload: res.data,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* deleteDone() {
  const filter = yield select(state => slice.selectors.selectFilter({ [slice.reducerPath]: state }))

  const body = { sort: filter.sort }

  if (filter.status) {
    body.status = filter.status
  }

  try {
    const res = yield call(axios.delete, '/todos', body)

    yield put({
      type: slice.actions.setItems.type,
      payload: res.data,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* getItems() {
  const filter = yield select(state => slice.selectors.selectFilter({ [slice.reducerPath]: state }))

  const params = { sortField: filter.sort.field, sortOrder: filter.sort.order }

  if (filter.status) {
    params.status = filter.status
  }

  try {
    const res = yield call(axios.get, '/todos', { params })

    yield put({
      type: slice.actions.setItems.type,
      payload: res.data,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* todos() {
  yield takeEvery(actionCreate.type, create)
  yield takeLatest(actionUpdateStatus.type, updateStatus)
  yield takeLatest(actionUpdateName.type, updateName)
  yield takeLatest(actionDeleteOne.type, deleteOne)
  yield takeLatest(actionDeleteDone.type, deleteDone)
  yield takeEvery(actionGetItems.type, getItems)
}

export default todos