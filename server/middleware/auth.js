export async function validateSignup(ctx, next) {
  if (
    !ctx.body.userName ||
    !ctx.body.password ||
    !ctx.body.firstName ||
    !ctx.body.lastName ||
    !ctx.body.email
  ) {
    ctx.throw(400, 'user name and password must be provided', {
      errors: {
        userName: !ctx.body.userName ? 'the field is required' : null,
        password: !ctx.body.password ? 'the field is required' : null,
        firstName: !ctx.body.firstName ? 'the field is required' : null,
        lastName: !ctx.body.lastName ? 'the field is required' : null,
        email: !ctx.body.email ? 'the field is required' : null,
      },
    })
  }

  await next()
}

export async function validateSignin() {
  if (!ctx.body.identifier || !ctx.body.password) {
    ctx.throw(400, 'user name and password must be provided', {
      errors: {
        identifier: !ctx.body.identifier ? 'the field is required' : null,
        password: !ctx.body.password ? 'the field is required' : null,
      },
    })
  }

  await next()
}
