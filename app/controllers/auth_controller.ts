import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { registerValidator } from '#validators/auth'

export default class AuthController {
  async store({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect('/products')
    } catch {
      return response.redirect().back().withErrors({
        login: ['Email ou senha inválidos.'],
      })
    }
  }

  async register({ request, response, auth }: HttpContext) {
  // 1. Deixe o AdonisJS/VineJS lidar com a validação.
  // SE FALHAR, ELE REDIRECIONA AUTOMATICAMENTE COM OS ERROS.
  const data = await request.validateUsing(registerValidator)

  try {
    // 2. Tente criar o usuário (aqui pode falhar por DB/Hash)
    const user = await User.create(data)

    // 3. Sucesso! Faça o login e redirecione
    await auth.use('web').login(user)
    return response.redirect('/products')
  } catch (error) {
    // 4. Se falhar na criação/login (ex: erro de DB)
    console.error('ERRO CRÍTICO no DB/Login:', error)
    
    // O erro não veio do VineJS, então podemos redirecionar com um erro geral
    return response.redirect().back().withErrors({
      general: ['Ocorreu um erro no servidor ao tentar criar sua conta.']
    })
  }
}

  /*
  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)
    await auth.use('web').login(user)

    return response.redirect('/products')
  }*/

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
