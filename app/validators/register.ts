// #validators/auth.ts (ou onde seu validador está)

import vine from '@vinejs/vine'
import User from '#models/user'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    email: vine.string()
      .email()
      .use(async (email, field) => {
        const exists = await User.findBy('email', email)
        if (exists) {
          field.report('E-mail já está em uso', 'email.exists', field)
        }
      }),
    
    // CORREÇÃO: Mude de minLength(6) para minLength(8)
    password: vine.string().minLength(8), 
  })
)