import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

/**
 * Interface para tipagem dos dados de atualização de perfil
 */
interface UpdatePayload {
  fullName?: string
  email?: string
  password?: string
}

export default class AuthController {
  /**
   * Exibe tela de login
   */
  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Login
   * - Valida as credenciais.
   * - Autentica o usuário.
   */
  async login({ request, response, auth, session }: HttpContext) {
    const webAuth = auth.use('web')

    try {
      // 1. Validação e obtenção dos dados tipados do body
      const { email, password } = await request.validateUsing(loginValidator)

      // 2. Busca e verifica as credenciais do usuário com tipagem explícita
      const user: User = await User.verifyCredentials(email, password)

      // 3. Efetua o login
      await (webAuth as any).login(user)

      // 4. Redireciona para o painel de produtos após o sucesso
      return response.redirect('/products')
    } catch (error) {
      console.error('Falha no Login:', error)

      // Redireciona de volta com uma mensagem de erro
      session.flash('error', 'Email ou senha inválidos.')
      return response.redirect().back()
    }
  }

  /**
   * Exibe tela de registro
   */
  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  /**
   * Registro de usuário
   * - Cria um novo usuário.
   * - Faz o login automático.
   */
  async register({ request, response, auth, session }: HttpContext) {
    const webAuth = auth.use('web')

    try {
      console.log('REGISTER BODY:', request.all())

      // 1. Validação dos dados
      const data = await request.validateUsing(registerValidator)
      console.log('VALIDATED DATA:', data)

      // 2. Criação do usuário como 'client' por padrão
      const user: User = await User.create({
        ...data,
        role: 'client',
      })
      console.log('USER CREATED:', user.email)

      // 3. Login automático após registro
      await (webAuth as any).login(user)
      console.log('USER LOGGED IN:', user.email)

      session.flash('success', 'Conta criada com sucesso!')
      return response.redirect('/products')
    } catch (error) {
      console.error('ERRO no registro:', error)

      session.flash('error', 'Erro ao criar conta. O email pode já estar em uso.')
      return response.redirect().back()
    }
  }

  /**
   * Logout
   */
  async logout({ auth, response, session }: HttpContext) {
    const webAuth = auth.use('web')

    await (webAuth as any).logout()
    session.flash('success', 'Você saiu da conta.')
    return response.redirect('/')
  }

  /**
   * Exibe o formulário de edição de perfil
   */
  async editProfile({ auth, view }: HttpContext) {
    const user: User = auth.user!
    return view.render('pages/auth/edit_profile', { user })
  }

  /**
   * Atualiza os dados do perfil do usuário
   */
  async updateProfile({ auth, request, response, session }: HttpContext) {
    try {
      const user: User = auth.user!

      // Pega apenas os campos permitidos para atualização
      const data = request.only(['fullName', 'email', 'password']) as UpdatePayload

      // Atualiza fullName se fornecido
      if (data.fullName && data.fullName.trim() !== '') {
        user.fullName = data.fullName.trim()
      }

      // Atualiza email se fornecido
      if (data.email && data.email.trim() !== '') {
        user.email = data.email.trim()
      }

      // Atualiza senha se fornecida (o hash é feito automaticamente pelo hook do model)
      if (data.password && data.password.trim() !== '') {
        user.password = data.password
      }

      await user.save()

      session.flash('success', 'Perfil atualizado com sucesso!')
      return response.redirect().back()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      session.flash('error', 'Erro ao atualizar perfil.')
      return response.redirect().back()
    }
  }
}