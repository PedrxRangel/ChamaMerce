// app/controllers/products_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

import Product from '#models/product'
import { createProductValidator } from '#validators/product'

export default class ProductsController {
// (Havia um 'S' solto aqui, eu removi)
  /**
   * (GET /products)
   * Lista todos os produtos.
   */
  public async index({ view }: HttpContext) {
    // 1. Busca TODOS os produtos no banco de dados
    const products = await Product.all() 
    
  console.log('📦 Produtos encontrados:', products.length)
  console.log('📦 Dados:', JSON.stringify(products, null, 2))
    // 2. (MUDANÇA "NUCLEAR")
    //    Vamos renderizar um ARQUIVO NOVO para enganar o cache.
    return view.render('pages/products/lista_final', { products })
  }
  
  /**
   * (GET /products/create)
   * Mostra o formulário de criação
  *
   */
  public async create({ view }: HttpContext) {
    // Apenas renderiza a view
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
    return response.redirect().toRoute('products.show', { id: product.id })
  }

  /**
   * (GET /products/:id)
   * Mostra a página de "Detalhar Produto".
   */
  public async show({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/show', { product })
  }

}