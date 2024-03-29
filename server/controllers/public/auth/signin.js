import jwt from 'jsonwebtoken'
import env from '../../../config.js'

import UserService from '../../../services/user.js'

export default async function signin(ctx) {
  const user = await UserService.getAndValidate(
    ctx.request.body.identifier,
    ctx.request.body.password
  )

  if (user === null) {
    ctx.throw(404, null, {
      errors: {
        identifier: { message: "user with given user name doesn't exist" },
      },
    })
  }

  if (user === false) {
    ctx.throw(400, null, { errors: { password: { message: 'incorrect password' } } })
  }

  const accessToken = jwt.sign({ id: user._id, email: user.email }, env.JWT_ACCESS_SECRET, {
    expiresIn: parseInt(env.JWT_ACCESS_EXPIRE),
  })

  const refreshToken = jwt.sign({ id: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: parseInt(env.JWT_REFRESH_EXPIRE),
  })

  user.refreshToken = {
    token: refreshToken,
    createdAt: new Date(),
  }

  try {
    await user.save()
  } catch (e) {
    ctx.throw(500, 'database threw an error')
  }

  ctx.cookies.set('jwt', refreshToken, {
    httpOnly: true,
    // secure: true,
    // sameSite: 'none',
    maxAge: parseInt(env.JWT_REFRESH_EXPIRE) * 1000,
  })

  ctx.send(200, {
    accessToken,
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      teamId: user.teamId || null,
    },
  })
}
