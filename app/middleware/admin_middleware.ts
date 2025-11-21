import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response, session }: HttpContext, next: NextFn) {
    // Verifica se o usuário está autenticado
    await auth.check()

    // Verifica se é admin
    if (auth.user?.role !== 'admin') {
      session.flash('error', 'Você não tem permissão para acessar esta página.')
      return response.redirect().toRoute('products.index')
    }

    await next()
  }
}