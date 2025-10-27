// app/models/product.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm' // <--- JEITO CORRETO (v6)

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id!: number // O '!' diz ao TypeScript que este valor existirá

  @column()
  public name!: string

  @column()
  public description!: string | null // Pode ser string ou nulo

  @column()
  public price!: number

  @column()
  public stock!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}