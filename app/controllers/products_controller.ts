// app/controllers/products_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

import Product from '#models/product' // <--- JEITO CORRETO (v6)
import { createProductValidator } from '#validators/product' // <--- JEITO CORRETO (v6)

export default class ProductsController {
  
  /**
   * (GET /products/create)
   * Mostra o formulário de criação
   */
  public async create({ view }: HttpContext) {
    // Apenas renderiza a view (que faremos no próximo passo)
    return view.render('pages/products/create')
  }

  /**
   * (POST /products)
   * Recebe os dados, valida e salva no banco
   */
  public async store({ request, response, session }: HttpContext) {
    
    // 1. Validar os dados. Se falhar, ele joga um erro.
    const payload = await request.validateUsing(createProductValidator)

    // 2. Se a validação passar, criar o produto
    const product = await Product.create(payload)

    // 3. Salvar uma mensagem de sucesso na sessão
    session.flash('success', `Produto "${product.name}" criado com sucesso!`)

    // 4. Redirecionar para a página de detalhes do produto
    // (Esta rota 'products.show' será criada no Passo 4)
    return response.redirect().toRoute('products.show', { id: product.id })
    
    /* Nota: O Adonis v6 lida com o 'catch' (erro de validação) 
    automaticamente. Se a validação falhar, ele mesmo 
    redireciona o usuário de volta ('redirect().back()') e 
    já envia os erros (flashMessages). Não precisamos do 'try...catch'
    para validação.
    */
  }

  /**
   * (GET /products/:id)
   * Mostra a página de "Detalhar Produto".
   * (Já vamos deixar pronta para o passo 4)
   */
  public async show({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/show', { product })
  }

  // ... (outros métodos como index, edit, update, destroy...)
}