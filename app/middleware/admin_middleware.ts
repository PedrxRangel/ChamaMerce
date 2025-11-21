import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

export default class AdminMiddleware {
  async handle({ auth, response, session }: HttpContext, next: NextFn) {
    // Verifica se o usuário está autenticado
    await auth.check()
    
    const user = auth.user as User | null
    
    if (!user) {
      session.flash('error', 'Você precisa estar logado.')
      return response.redirect('/login')
    }

    // Verifica se é admin
    if (user.role !== 'admin') {
      session.flash('error', 'Acesso negado. Apenas administradores podem acessar esta área.')
      return response.redirect('/products')
    }

    await next()
  }
}