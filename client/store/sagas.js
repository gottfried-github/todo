import { createAction } from '@reduxjs/toolkit'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from './http'

import slice from './slice'

class Item {
  constructor(name) {
    this.name = name
  }
}

export const create = createAction('saga/create')
export const updateStatus = createAction('saga/updateStatus')
export const updateName = createAction('saga/updateName')
export const deleteOne = createAction('saga/deleteOne')
export const deleteDone = createAction('saga/deleteDone')
export const getItems = createAction('saga/getItems')

function* create(action) {
  const item = new Item(action.payload)

  try {
    const res = yield call(axios.post, '/todos', item)

    yield put({
      type: slice.actions.append.type,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* updateStatus(action) {
  try {
    yield call(axios.patch, `/todos/${action.payload.id}`, {
      status: action.payload.status,
    })

    yield put({
      type: slice.actions.updateItem.type,
      payload: { id: action.payload.id, fields: { status: action.payload.status } },
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* updateName(action) {
  try {
    yield call(axios.patch, `/todos/${action.payload.id}`, {
      name: action.payload.name,
    })

    yield put({
      type: slice.actions.updateItem.type,
      payload: { id: action.payload.id, fields: { name: action.payload.name } },
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* deleteOne(action) {
  try {
    yield call(axios.delete, `/todos/${action.payload}`)

    yield put({
      type: slice.actions.deleteItem.type,
      payload: action.payload,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* deleteDone(action) {
  try {
    yield call(axios.delete, '/todos')

    yield put({
      type: slice.actions.deleteDone.type,
    })
  } catch (e) {
    yield put({
      type: slice.actions.setError.type,
      payload: e,
    })
  }
}

function* getItems(action) {
  try {
    const res = yield call(axios.get, '/todos')

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

class Saga {
  constructor() {
    this.init()
  }

  init = () => {
    EventEmitter.subscribe(Events.ITEM_CREATE, this._create)
    EventEmitter.subscribe(Events.ITEM_UPDATE_STATUS_ONE, this._updateStatus)
    EventEmitter.subscribe(Events.ITEM_UPDATE_NAME, this._updateName)
    EventEmitter.subscribe(Events.ITEM_DELETE_ONE, this._delete)
    EventEmitter.subscribe(Events.ITEM_DELETE_DONE, this._deleteDone)
  }

  unsubscribe = () => {
    EventEmitter.subscribe(Events.ITEM_CREATE, this._create)
    EventEmitter.subscribe(Events.ITEM_UPDATE_STATUS_ONE, this._updateStatus)
    EventEmitter.subscribe(Events.ITEM_UPDATE_NAME, this._updateName)
    EventEmitter.subscribe(Events.ITEM_DELETE_ONE, this._delete)
    EventEmitter.subscribe(Events.ITEM_DELETE_DONE, this._deleteDone)
  }

  _create = async name => {
    const item = new Item(name)

    try {
      const response = await axios.post('/todos', item)

      EventEmitter.emit({
        type: Events.SAGA_ITEM_CREATED,
        payload: response.data,
      })
    } catch (e) {
      console.log('Saga._create, axios errored - error:', e)
    }
  }

  _updateStatus = async ({ id, status }) => {
    try {
      await axios.patch(`/todos/${id}`, { status })

      EventEmitter.emit({
        type: Events.SAGA_ITEM_UPDATED,
        payload: { id, fields: { status } },
      })
    } catch (e) {
      console.log('Saga._updateStatus, axios errored - error:', e)
    }
  }

  _updateName = async ({ id, name }) => {
    try {
      await axios.patch(`/todos/${id}`, { name })

      EventEmitter.emit({
        type: Events.SAGA_ITEM_UPDATED,
        payload: { id, fields: { name } },
      })
    } catch (e) {
      console.log('Saga._updateName, axios errored - error:', e)
    }
  }

  _delete = async id => {
    try {
      await axios.delete(`/todos/${id}`)

      EventEmitter.emit({
        type: Events.SAGA_ITEM_DELETED,
        payload: id,
      })
    } catch (e) {
      console.log('Saga._delete, axios errored - error:', e)
    }
  }

  _deleteDone = async () => {
    try {
      await axios.delete('/todos')

      EventEmitter.emit({
        type: Events.SAGA_DONE_DELETED,
      })
    } catch (e) {
      console.log('Saga._deleteDone, axios errored - error:', e)
    }
  }

  async getItems() {
    try {
      const response = await axios.get('/todos')

      return response.data
    } catch (e) {
      console.log('Saga.getItems, axios errored - error:', e)
    }
  }
}

export default new Saga()
