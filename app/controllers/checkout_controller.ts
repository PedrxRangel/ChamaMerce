import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import CartItem from '#models/cart_item'

export default class CheckoutController {
  public async store({ auth, response, session }: HttpContext) {
    const user = auth.user!

    // pega tudo do carrinho
    const cartItems = await CartItem
      .query()
      .where('user_id', user.id)
      .preload('product')

    if (cartItems.length === 0) {
      session.flash('error', 'Seu carrinho está vazio!')
      return response.redirect().back()
    }

    // calcula total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    // cria ordem
    const order = await Order.create({
      userId: user.id,
      total
    })

    // cria items
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })
    }

    // limpa carrinho
    await CartItem.query().where('user_id', user.id).delete()

    // flash de sucesso
    session.flash('success', 'Compra realizada com sucesso!')

    // redireciona para a página inicial (lista de produtos)
    return response.redirect().toRoute('products.index')
  }
}
