// app/validators/product.ts
import vine from '@vinejs/vine'

/**
 * Validador para a criação de um novo produto.
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().optional(),
    
    // CORRIGIDO: Usamos .min(0) para garantir que não é negativo
    price: vine.number().min(0), 
    
    // CORRIGIDO: Usamos .min(0) para garantir que não é negativo
    stock: vine.number().min(0).withoutDecimals() 
  })
)

/**
 * (Opcional, para o futuro)
 * Validador para a atualização de um produto.
 */
// export const updateProductValidator = vine.compile(
//   vine.object({
//     name: vine.string().trim().minLength(3).maxLength(255).optional(),
//     description: vine.string().trim().optional(),
//     price: vine.number().min(0).optional(),
//     stock: vine.number().min(0).withoutDecimals().optional()
//   })
// )