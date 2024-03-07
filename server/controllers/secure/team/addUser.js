import mongoose from 'mongoose'

import User from '../../../models/user.js'
import Team from '../../../models/team.js'

export default async function addUser(ctx) {
  try {
    const team = Team.findById(ctx.params.teamId)

    if (!team) {
      ctx.send(404, "specified team doesn't exist")
      return
    }

    const res = await User.updateOne(
      { _id: ctx.params.userId },
      { teamId: ctx.params.teamId },
      {
        runValidators: true,
      }
    )

    if (!res.matchedCount) {
      ctx.send(404, "specified user doesn't exist")
      return
    }

    ctx.send(200, null, 'successfully added the user to the team')
  } catch (e) {
    if (e instanceof mongoose.Error.CastError || e instanceof mongoose.Error.ValidationError) {
      ctx.throw(400, 'validation failed', e)
    }

    ctx.throw(500, e)
  }
}
