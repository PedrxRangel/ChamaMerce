// app/validators/auth.ts

import vine from '@vinejs/vine'

/**
 * Validador de login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(8),
  })
)

/**
 * Validador de registro
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(255),
  })
)