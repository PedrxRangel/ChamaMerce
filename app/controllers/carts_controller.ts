import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import User from '#models/user'

export default class CartsController {
  /**
   * Ver carrinho
   */
  async index({ auth, view }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>
    
    const cartItems = await CartItem.query()
      .where('userId', user.id)
      .preload('product')
      .orderBy('created_at', 'desc')
    
    let total = 0
    cartItems.forEach(item => {
      total += parseFloat(item.product.price.toString()) * item.quantity
    })
    
    return view.render('pages/cart/index', { cartItems, total })
  }

  /**
   * Adicionar produto ao carrinho
   */
  async add({ auth, params, response, session }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>
    const productId = params.id
    
    try {
      const product = await Product.findOrFail(productId)
      
      if (product.stock <= 0) {
        session.flash('error', 'Produto sem estoque')
        return response.redirect().back()
      }
      
      const existingItem = await CartItem.query()
        .where('userId', user.id)
        .where('productId', productId)
        .first()
      
      if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
          session.flash('error', 'Estoque insuficiente')
          return response.redirect().back()
        }
        
        existingItem.quantity += 1
        await existingItem.save()
      } else {
        await CartItem.create({
          userId: user.id,
          productId: Number(productId),
          quantity: 1
        })
      }
      
      session.flash('success', 'Produto adicionado ao carrinho!')
      return response.redirect().back()
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      session.flash('error', 'Erro ao adicionar produto')
      return response.redirect().back()
    }
  }

  /**
   * Remover produto do carrinho
   */
  async remove({ auth, params, response, session }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>
    const cartItemId = params.id
    
    try {
      const cartItem = await CartItem.query()
        .where('id', Number(cartItemId))
        .where('userId', user.id)
        .firstOrFail()
      
      await cartItem.delete()
      
      session.flash('success', 'Produto removido do carrinho')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Erro ao remover produto')
      return response.redirect().back()
    }
  }

  /**
   * Aumentar quantidade
   */
  async increaseQuantity({ auth, params, response, session }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>
    const cartItemId = params.id
    
    try {
      const cartItem = await CartItem.query()
        .where('id', Number(cartItemId))
        .where('userId', user.id)
        .preload('product')
        .firstOrFail()
      
      if (cartItem.quantity + 1 > cartItem.product.stock) {
        session.flash('error', 'Estoque insuficiente')
        return response.redirect().back()
      }
      
      cartItem.quantity += 1
      await cartItem.save()
      
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Erro ao atualizar quantidade')
      return response.redirect().back()
    }
  }

  /**
   * Diminuir quantidade
   */
  async decreaseQuantity({ auth, params, response, session }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>
    const cartItemId = params.id
    
    try {
      const cartItem = await CartItem.query()
        .where('id', Number(cartItemId))
        .where('userId', user.id)
        .firstOrFail()
      
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1
        await cartItem.save()
      } else {
        await cartItem.delete()
      }
      
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Erro ao atualizar quantidade')
      return response.redirect().back()
    }
  }

  /**
   * Limpar carrinho
   */
  async clear({ auth, response, session }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>

    await CartItem.query().where('userId', user.id).delete()
    
    session.flash('success', 'Carrinho limpo!')
    return response.redirect().toRoute('cart.index')
  }
}