// app/controllers/products_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
  /**
   * (GET /products)
   * Lista todos os produtos.
   */
  public async index({ view, request }: HttpContext) {
  const page = Number(request.input('page', 1))
  const limit = 2

  const products = await Product
    .query()
    .orderBy('id', 'desc')
    .paginate(page, limit)

  products.baseUrl('/products')

  return view.render('pages/products/lista_final', {
    products: products.all(),  // ← AGORA NÃO QUEBRA A PAGINAÇÃO
    meta: products.getMeta(),  // ← AGORA EXISTE META NA VIEW
  })
}

  public async create({ view }: HttpContext) {
    return view.render('pages/products/create')
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    const product = await Product.create(payload)
    session.flash('success', `Produto "${product.name}" criado com sucesso!`)
    return response.redirect().toRoute('products.show', { id: product.id })
  }

  public async show({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/show', { product })
  }

  public async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/edit', { product })
  }

  public async update({ params, request, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(updateProductValidator)
    await product.merge(payload).save()
    session.flash('success', `Produto "${product.name}" atualizado com sucesso!`)
    return response.redirect().toRoute('products.show', { id: product.id })
  }

  public async destroy({ params, request, response, session }: HttpContext) {
    console.log('🔍 Método recebido:', request.method())
    console.log('🔍 Body recebido:', request.all())

    const product = await Product.findOrFail(params.id)
    const productName = product.name
    await product.delete()

    session.flash('success', `Produto "${productName}" foi removido com sucesso!`)
    return response.redirect().toRoute('products.index')
  }
}