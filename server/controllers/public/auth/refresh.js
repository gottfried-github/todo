import jwt from 'jsonwebtoken'
import env from '../../../config.js'

import User from '../../../models/user.js'

export default async function refresh(ctx) {
  if (!ctx.cookies.get('jwt')) {
    ctx.throw(401, 'no refresh token')
  }

  const refreshToken = ctx.cookies.get('jwt')
  let tokenDecoded = null

  try {
    tokenDecoded = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, async (e, token) => {
        if (e) {
          reject(e)
        }

        resolve(token)
      })
    })
  } catch (e) {
    ctx.throw(401, 'refresh token is invalid')
  }

  const user = await User.findById(tokenDecoded.id)
  if (!user) {
    ctx.throw(403, 'no user matches the refresh token')
  }

  if (
    Date.now() - user.refreshToken.createdAt.getTime() >=
    parseInt(env.JWT_REFRESH_EXPIRE) * 1000
  ) {
    ctx.throw(401, 'refresh token has expired')
  }

  const accessToken = jwt.sign({ id: user._id, email: user.email }, env.JWT_ACCESS_SECRET, {
    expiresIn: parseInt(env.JWT_ACCESS_EXPIRE),
  })

  const refreshTokenNew = jwt.sign({ id: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: parseInt(env.JWT_REFRESH_EXPIRE),
  })

  ctx.cookies.set('jwt', refreshTokenNew, {
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
