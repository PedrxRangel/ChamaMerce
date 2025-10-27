// start/routes.ts
import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

// 1. Importe o controller de produtos (Sintaxe v6)
import ProductsController from '#controllers/products_controller'

// Rota padrão (pode deixar se quiser)
router.get('/', async ({ view }: HttpContext) => {
  // Vamos usar a view 'welcome' que já existe em 'pages'
  return view.render('pages/welcome')
})

// 2. Esta linha mágica cria TODAS as rotas de produto:
// GET /products          (products.index) - Listar
// GET /products/create   (products.create) - Mostrar formulário
// POST /products         (products.store) - Salvar formulário
// GET /products/:id      (products.show) - Detalhar
// GET /products/:id/edit (products.edit) - Mostrar formulário de edição
// PUT /products/:id      (products.update) - Salvar edição
// DELETE /products/:id   (products.destroy) - Deletar
router.resource('products', ProductsController)