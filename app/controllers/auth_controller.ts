import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { registerValidator } from '#validators/auth'

export default class AuthController {
  
  async store({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // 1. Tenta verificar as credenciais (essa linha lança exceção se falhar)
      const user = await User.verifyCredentials(email, password)
      
      // 2. Login bem-sucedido
      await auth.use('web').login(user)
      
      // 3. Redirecionamento de sucesso
      return response.redirect('/products')
      
    } catch (error) {
      // 4. Se falhar (credenciais inválidas):
      
      // Se for uma exceção conhecida de Auth, redirecionamos de volta com a flash message.
      // Usamos a sintaxe COMPLETA de catch (error) e o método withErrors:

      // Adicione um console.error para ter certeza que é o erro de credenciais:
      console.error('Falha no Login:', error)
      
      return response.redirect().back().withErrors({
        login: ['Email ou senha inválidos.'],
      })
      
      // OBS: Se você tiver um validador de VineJS para login, você não precisa do try/catch, 
      // pois o request.validateUsing(loginValidator) lida com a maioria dos erros.
    }
  }
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    
    // Mude de '/' para '/login'
    return response.redirect('/login') 
  }
  async create({ view }: HttpContext) {
    return view.render('pages/auth/register') // Assumindo que seu arquivo é 'pages/auth/register.edge'
}
async register({ request, response, auth }: HttpContext) {
  // 1. Validação (deixa o AdonisJS lidar com os erros de input)
  const data = await request.validateUsing(registerValidator)

  try {
    // 2. Criação e Login
    const user = await User.create(data)
    await auth.use('web').login(user)

    // 3. Sucesso!
    return response.redirect('/products')

  } catch (error) {
    // 4. Falha no DB (hash de senha, e-mail duplicado, etc.)
    console.error('ERRO CRÍTICO no DB/Login:', error)
    
    // Redireciona de volta com um erro geral
    return response.redirect().back().withErrors({
      // Use 'email' aqui se o erro for duplicidade de e-mail, ou 'general'
      email: ['Ocorreu um erro ao tentar cadastrar. Talvez o e-mail já esteja em uso.'],
    })
  }
}
}
