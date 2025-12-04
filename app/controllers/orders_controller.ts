import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Product from '#models/product'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class OrdersController {
  
  /** Finalizar compra */
  async checkout({ auth, response, session }: HttpContext) {
    await auth.authenticate()
    const user = auth.user as InstanceType<typeof User>

    const cartItems = await CartItem.query()
      .where('userId', user.id)
      .preload('product')

    if (cartItems.length === 0) {
      session.flash('error', 'Seu carrinho está vazio!')
      return response.redirect().back()
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    )

    const order = await Order.create({ userId: user.id, total })

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })

      item.product.stock -= item.quantity
      await item.product.save()
    }

    await CartItem.query().where('userId', user.id).delete()

    session.flash('success', 'Compra realizada com sucesso!')
    return response.redirect().toRoute('orders.history')
  }

  public async history({ auth, view, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)

    const orders = await Order.query()
      .where('userId', user.id)
      .orderBy('created_at', 'desc')
      .preload('items', (itemsQuery) => {
        itemsQuery.preload('product')
      })
      .paginate(page, 5)

    const ordersWithFormatted = orders.all().map(order => {
      const formattedItems = order.items.map(item => ({
        ...item,
        subtotal: (Number(item.price) * Number(item.quantity)).toFixed(2)
      }))

      return {
        ...order,
        // Ajuste do horário
        formattedDate: DateTime.fromJSDate(order.createdAt)
          .setZone('America/Sao_Paulo')
          .toFormat('dd/LL/yyyy HH:mm'),
        items: formattedItems,
        total: Number(order.total).toFixed(2),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }
    })

    return view.render('pages/orders/history', {
      orders: ordersWithFormatted,
      meta: orders.getMeta(),
    })
  }
}
