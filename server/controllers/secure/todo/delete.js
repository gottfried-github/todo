import mongoose from 'mongoose'

import { ITEM_DELETE } from '../../../events/index.js'
import Todo from '../../../models/todo.js'

export default async function deleteById(ctx) {
  try {
    const item = await Todo.findById(ctx.params.id)

    if (!item) {
      ctx.throw(404, 'no item with given id')
    }

    if (item.user.toString() !== ctx.state.user.id) {
      ctx.throw(403, "the item doesn't belong to the current user")
    }

    const _res = await Todo.deleteOne({ _id: ctx.params.id, user: ctx.state.user.id })

    if (_res.deletedCount === 0) {
      ctx.throw(500, 'no documents have been deleted')
    }

    ctx.socketSend(ITEM_DELETE, item)

    ctx.send(200, item)
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      ctx.throw(400, 'validation error', e)
    }

    if (e.status) {
      throw e
    }

    ctx.throw(500, 'database errored', e)
  }
}
