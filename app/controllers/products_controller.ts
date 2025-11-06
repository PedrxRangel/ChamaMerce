// app/controllers/products_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
  /**
   * (GET /products)
   * Lista todos os produtos.
   */
  public async index({ view }: HttpContext) {
    const products = await Product.all()
    console.log('📦 Produtos encontrados:', products.length)
    return view.render('pages/products/lista_final', { products })
  }
  
  /**
   * (GET /products/create)
   * Mostra o formulário de criação
   */
  public async create({ view }: HttpContext) {
    return view.render('pages/products/create')
  }

  /**
   * (POST /products)
   * Recebe os dados, valida e salva no banco
   */
  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    const product = await Product.create(payload)
    session.flash('success', `Produto "${product.name}" criado com sucesso!`)
    return response.redirect().toRoute('products.show', { id: product.id })
  }

  /**
   * (GET /products/:id)
   * Mostra a página de detalhes do produto.
   */
  public async show({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/show', { product })
  }

  /**
   * (GET /products/:id/edit)
   * Mostra o formulário de edição preenchido
   */
  public async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/edit', { product })
  }

  /**
   * (PUT/PATCH /products/:id)
   * Atualiza o produto no banco de dados
   */
  public async update({ params, request, response, session }: HttpContext) {
    // 1. Buscar o produto
    const product = await Product.findOrFail(params.id)
    
    // 2. Validar os novos dados
    const payload = await request.validateUsing(updateProductValidator)
    
    // 3. Atualizar o produto
    await product.merge(payload).save()
    
    // 4. Mensagem de sucesso
    session.flash('success', `Produto "${product.name}" atualizado com sucesso!`)
    
    // 5. Redirecionar para a página de detalhes
    return response.redirect().toRoute('products.show', { id: product.id })
  }

  /**
   * (DELETE /products/:id)
   * Remove o produto do banco de dados
   */
  public async destroy({ params, response, session }: HttpContext) {
    // 1. Buscar o produto
    const product = await Product.findOrFail(params.id)
    
    // 2. Guardar o nome antes de deletar
    const productName = product.name
    
    // 3. Deletar do banco
    await product.delete()
    
    // 4. Mensagem de sucesso
    session.flash('success', `Produto "${productName}" foi removido com sucesso!`)
    
    // 5. Redirecionar para a lista
    return response.redirect().toRoute('products.index')
  }
}