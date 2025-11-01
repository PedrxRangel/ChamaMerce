import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProductsController from '#controllers/products_controller'
const AuthController = () => import('#controllers/auth_controller')

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

// Rota POST para processar o cadastro (usa o método que você me enviou)
router.post('register', [AuthController, 'register'])

router.resource('products', ProductsController)
  .use(middleware.auth())