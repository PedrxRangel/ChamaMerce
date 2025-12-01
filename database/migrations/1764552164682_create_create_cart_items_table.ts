import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.integer('quantity').unsigned().defaultTo(1)
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
      
      // Um usuário não pode ter o mesmo produto duplicado no carrinho
      table.unique(['user_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}