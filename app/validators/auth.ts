// app/validators/auth.ts

import vine from '@vinejs/vine'

/**
 * Define o validador para a criação/registro de usuário (Exemplo)
 */
export const registerValidator = vine.compile(
  vine.object({
    // Adapte este para o seu User Model
    fullName: vine.string().trim().minLength(3).maxLength(64),
    email: vine.string().trim().email(),
    password: vine.string().minLength(8),
  })
)

/**
 * Define o validador para o LOGIN (Email e Senha)
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    
    // Para o login, geralmente não precisamos de um minLength/maxLength,
    // apenas garantir que é uma string e que foi preenchida.
    password: vine.string(), 
  })
)

// Você pode opcionalmente definir as 'types' para ter mais segurança no TypeScript
export type LoginValidator = typeof loginValidator.type
export type RegisterValidator = typeof registerValidator.type