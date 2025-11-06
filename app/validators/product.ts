// app/validators/product.ts
import vine from '@vinejs/vine'

/**
 * Validador para CRIAR produto
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().nullable().optional(),
    price: vine.number().positive().decimal([0, 2]),
    stock: vine.number().positive().withoutDecimals()
  })
)

/**
 * Validador para ATUALIZAR produto
 * (Mesmas regras que criar, mas todos os campos são opcionais)
 */
export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().nullable().optional(),
    price: vine.number().positive().decimal([0, 2]).optional(),
    stock: vine.number().positive().withoutDecimals().optional()
  })
)