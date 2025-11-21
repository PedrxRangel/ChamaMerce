import { BaseCommand, args } from '@adonisjs/core/ace'
import User from '#models/user'

export default class MakeAdmin extends BaseCommand {
  static commandName = 'make:admin'
  static description = 'Torna um usuário administrador'

  @args.string({ description: 'Email do usuário' })
  declare email: string

  async run() {
    try {
      // Buscar o usuário
      const user = await User.query().where('email', this.email).first()

      if (!user) {
        this.logger.error(`❌ Usuário com email "${this.email}" não encontrado`)
        return
      }

      // Atualizar para admin
      user.role = 'admin'
      await user.save()

      this.logger.success(`✅ ${user.fullName} agora é ADMIN!`)
      
    } catch (error) {
      this.logger.error('❌ Erro ao tornar usuário admin')
      console.error(error)
    }
  }
}