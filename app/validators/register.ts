// app/validators/register.ts
import vine from '@vinejs/vine'
import User from '#models/user'

/**
 * Validador customizado para email único
 */
const uniqueEmail = vine.createRule(async (value, _, field) => {
  if (!value) {
    return
  }

  const user = await User.findBy('email', value)

  if (user) {
    field.report('O e-mail já está em uso', 'database.unique', field)
  }
})

/**
 * Schema de validação para registro
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(255),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .use(uniqueEmail()),
    password: vine.string().minLength(8).maxLength(255),
  })
)