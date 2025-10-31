import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProductsController from '#controllers/products_controller'
import LoginController from '#controllers/login_controller'

router.on('/login')
  .render('pages/auth/login')
  .use(middleware.guest())

router.post('/login', [AuthController, 'store'])
  .use(middleware.guest())

router.post('/logout', [AuthController, 'destroy'])
  .use(middleware.auth())

router.group(() => {
  router.resource('products', ProductsController)
}).use(middleware.auth())