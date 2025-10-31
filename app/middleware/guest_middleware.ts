import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const guard = 'web'
    const redirectTo = '/products'

    try {
      if (await auth.use(guard).check()) {
        return response.redirect(redirectTo)
      }
    } catch {}

    return next()
  }
}
