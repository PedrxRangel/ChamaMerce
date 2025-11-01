import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProductsController from '#controllers/products_controller'

router.on('/login')
  .render('pages/auth/login')
  .use(middleware.guest())

router.post('/login', [AuthController, 'store'])
  .use(middleware.guest())

router.post('/logout', [AuthController, 'destroy'])
  .as('auth.logout')
  .use(middleware.auth())

router.on('/register')
  .render('pages/auth/register')
  .use(middleware.guest())

router.post('/register', [AuthController, 'register'])
  .use(middleware.guest())

router.resource('products', ProductsController)
  .use(middleware.auth())