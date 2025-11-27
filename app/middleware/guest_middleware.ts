// app/middleware/guest_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      // Tenta verificar se está autenticado
      await auth.check()
      
      // Se chegou aqui, está autenticado → redireciona
      if (auth.isAuthenticated) {
        return response.redirect().toRoute('products.index')
      }
    } catch {
      // Não está autenticado → permite continuar
    }

    return next()
  }
}