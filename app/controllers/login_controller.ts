// app/controllers/login_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class LoginController {
  /**
   * Mostrar formulário de login
   */
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Processar login
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Usar verifyCredentials + login ao invés de attempt
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      
      return response.redirect().toRoute('products.index')
    } catch (error) {
      session.flash('error', 'Credenciais inválidas. Tente novamente.')
      return response.redirect().back()
    }
  }

  /**
   * Logout
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login')
  }
}