import User from '../../../models/user.js'
import Team from '../../../models/team.js'

export default async function get(ctx) {
  try {
    const team = await Team.findById(ctx.params.teamId)

    if (!team) {
      ctx.throw(404, "specified team doesn't exist")
    }

    const users = await User.find(
      { teamId: team._id },
      {
        password: 0,
        refreshToken: 0,
      }
    )

    const usersFiltered = users.filter(user => user._id.toString() !== ctx.state.user.id)

    ctx.send(200, { data: team, members: usersFiltered })
  } catch (e) {
    if (e.status) {
      throw e
    }

    ctx.throw(500, 'database errored', e)
  }
}
