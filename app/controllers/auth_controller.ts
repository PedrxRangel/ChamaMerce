// app/controllers/auth_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
// AGORA FUNCIONA: Importando o loginValidator
import { loginValidator } from '#validators/auth' 

export default class AuthController {
  
  // ... (Método create para mostrar o formulário, se necessário)

  /**
   * Executar o login
   */
  async store({ request, response, auth }: HttpContext) {
    // 1. Validação da entrada
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      // 2. Verifica as credenciais usando o mixin AuthFinder no User Model
      const user = await User.verifyCredentials(email, password)
      
      // 3. Cria a sessão de login usando o Session Guard 'web'
      await auth.use('web').login(user)

      // 4. Redireciona
      return response.redirect().toRoute('products.index') 
    } catch (error) {
      // Em caso de credenciais inválidas ou qualquer erro de autenticação
      return response.redirect().back().withErrors({
        login: ['Email ou senha inválidos.'],
      })
    }
  }

  /**
   * Executar o logout
   */
  async destroy({ auth, response }: HttpContext) {
    // 1. Remove a sessão do usuário
    await auth.use('web').logout() 

    // 2. Redireciona para a home
    return response.redirect().toRoute('auth.create') 
  }
}