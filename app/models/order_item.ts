import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import Order from './order.js'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  id: number

  @column()
  orderId: number

  @column()
  productId: number

  @column()
  quantity: number

  @column()
  price: number

  @belongsTo(() => Product)
  product: BelongsTo<typeof Product>

  @belongsTo(() => Order)
  order: BelongsTo<typeof Order>

  @column.dateTime({ autoCreate: true })
  createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt: DateTime
}
