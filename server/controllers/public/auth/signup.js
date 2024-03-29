import jwt from 'jsonwebtoken'
import env from '../../../config.js'

import UserService from '../../../services/user.js'

export default async function signup(ctx) {
  try {
    const user = await UserService.create(ctx.request.body)

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

    ctx.send(201, {
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
  } catch (e) {
    // 11000 === unique index violation
    if (e.code === 11000) {
      const errors = {}

      if ('userName' in e.keyPattern) {
        errors.userName = { message: 'given user name already exists' }
      } else if ('email' in e.keyPattern) {
        errors.email = { message: 'given email already exists' }
      }

      if (!Object.keys(errors).length) {
        ctx.throw(500, 'unexpected unique index violation', e)
      }

      ctx.throw(400, null, { errors })
    }

    if (e.status) {
      throw e
    }

    ctx.throw(500, 'database errored while creating user', e)
  }
}
