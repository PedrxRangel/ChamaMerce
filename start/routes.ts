import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProductsController from '#controllers/products_controller'
// A linha duplicada 'const AuthController' foi removida.

router.get('/', async ({ view }) => {
  return view.render('pages/home')
})

router.on('/login')
  .render('pages/auth/login')
  .use(middleware.guest())

router.post('/login', [AuthController, 'store'])
  .use(middleware.guest())

router.post('/logout', [AuthController, 'destroy'])
  .as('auth.logout')
  .use(middleware.auth())

// Rota GET para mostrar o formulário de cadastro
router.get('register', [AuthController, 'create'])

// Rota POST para processar o cadastro
router.post('register', [AuthController, 'register'])

// --- CORREÇÃO APLICADA AQUI ---
// Agrupamos o resource para aplicar o middleware 'auth'
// a todas as rotas dele (index, create, store, show, edit, update, destroy)
router.group(() => {
  router.resource('products', ProductsController)
}).use(middleware.auth())