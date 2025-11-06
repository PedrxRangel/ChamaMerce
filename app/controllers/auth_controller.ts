import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Login
   */
  async store({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect('/products')
    } catch (error) {
      console.error('Falha no Login:', error)

      session.flash('errors', {
        login: ['Email ou senha inválidos.'],
      })

      return response.redirect().back()
    }
  }

  /**
   * Logout
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }

  /**
   * Exibe tela de registro
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  /**
   * Registro de usuário
   */
async register({ request, response, auth, session }: HttpContext) {
  try {
    // Log para verificar o corpo recebido
    console.log('REGISTER BODY:', request.all())

    // Validação dos dados
    const data = await request.validateUsing(registerValidator)
    console.log('VALIDATED DATA:', data)

    // Criação do usuário
    const user = await User.create(data)
    console.log('USER CREATED:', user)

    // Login automático após registro
    await auth.use('web').login(user)
    console.log('USER LOGGED IN:', user.email)

    // Redireciona para a página de produtos
    return response.redirect('/products')
  } catch (error) {
    console.error('ERRO CRÍTICO no DB/Login:', error)

    // Mensagem de erro para o usuário
    session.flash('errors', {
      email: ['Ocorreu um erro ao tentar cadastrar. Talvez o e-mail já esteja em uso.'],
    })

    return response.redirect().back()
  }
}

  /**
   * Exibe o formulário de edição de perfil
   */
  async editProfile({ auth, view }: HttpContext) {
    const user = auth.user!
    return view.render('pages/auth/edit_profile', { user })
  }

  /**
   * Atualiza os dados do perfil do usuário
   */
  async updateProfile({ auth, request, response, session }: HttpContext) {
    try {
      const user = auth.user!
      const data = request.only(['name', 'email', 'password'])

      user.fullName = data.name
      user.email = data.email

      if (data.password && data.password.trim() !== '') {
        user.password = data.password
      }

      await user.save()

      session.flash('success', 'Perfil atualizado com sucesso!')
      return response.redirect().toPath('/profile/edit')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      session.flash('error', 'Ocorreu um erro ao atualizar seu perfil.')
      return response.redirect().back()
    }
  }
}
