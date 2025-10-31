// app/controllers/login_controller.ts (ou auth_controller.ts)

import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  // ... método show()
  public async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  public async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.use('web').attempt(email, password)
      // ✅ CORREÇÃO: Usar toRoute() com o nome da rota de produtos
      return response.redirect().toRoute('products.index') 
    } catch {
      session.flash({ login: 'Credenciais inválidas. Tente novamente.' }) // Usando 'login' como chave de flash
      // ✅ CORREÇÃO: Usar toRoute() para redirecionar para o formulário de login
      return response.redirect().toRoute('auth.create')
    }
  }
}