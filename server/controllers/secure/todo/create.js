import mongoose from 'mongoose'

import { ITEM_CREATE } from '../../../events/index.js'
import Todo from '../../../models/todo.js'

export default async function create(ctx) {
  try {
    const item = await Todo.create({ ...ctx.request.body, user: ctx.state.user.id })

    await item.populate('user', { id: 1, userName: 1 })

    ctx.socketSend(ITEM_CREATE, item)

    ctx.send(201, item)
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      ctx.throw(400, 'validation error', e)
    }

    ctx.throw(500, 'database errored', e)
  }
}
