import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProductsController from '#controllers/products_controller'

// Página inicial
router.get('/', async ({ view }) => {
  return view.render('pages/home')
})

// Login
router.on('/login')
  .render('pages/auth/login')
  .use(middleware.guest())

router.post('/login', [AuthController, 'store'])
  .use(middleware.guest())

// Logout
router.post('/logout', [AuthController, 'destroy'])
  .as('auth.logout')
  .use(middleware.auth())

// Registro
router.get('register', [AuthController, 'create'])
router.post('register', [AuthController, 'register'])

// Grupo de rotas autenticadas
router.group(() => {
  router.resource('products', ProductsController)

  // Rota para editar perfil
  router.get('/profile/edit', [AuthController, 'editProfile'])
  router.post('/profile/edit', [AuthController, 'updateProfile'])
}).use(middleware.auth())
