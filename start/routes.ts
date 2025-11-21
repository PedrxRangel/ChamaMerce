import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')

// ==========================================
// ROTAS PÚBLICAS
// ==========================================

// Página inicial
router.get('/', async ({ view }) => {
  return view.render('pages/home')
})

// Autenticação
router.get('/login', [AuthController, 'showLogin']).as('auth.login')
router.post('/login', [AuthController, 'login'])

router.get('/register', [AuthController, 'showRegister']).as('auth.register')
router.post('/register', [AuthController, 'register'])

router.post('/logout', [AuthController, 'logout'])
  .as('auth.logout')
  .use(middleware.auth())

// ==========================================
// ROTAS AUTENTICADAS (TODOS)
// ==========================================

// Listar e ver produtos
router.get('/products', [ProductsController, 'index'])
  .as('products.index')
  .use(middleware.auth())

router.get('/products/:id', [ProductsController, 'show'])
  .as('products.show')
  .use(middleware.auth())

// Perfil
router.get('/profile/edit', [AuthController, 'editProfile'])
  .as('profile.edit')
  .use(middleware.auth())

router.post('/profile', [AuthController, 'updateProfile'])
  .as('profile.update')
  .use(middleware.auth())

// ==========================================
// ROTAS APENAS ADMIN
// ==========================================

// Criar produto
router.get('/products/create', [ProductsController, 'create'])
  .as('products.create')
  .use([middleware.auth(), middleware.admin()])

router.post('/products', [ProductsController, 'store'])
  .as('products.store')
  .use([middleware.auth(), middleware.admin()])

// Editar produto
router.get('/products/:id/edit', [ProductsController, 'edit'])
  .as('products.edit')
  .use([middleware.auth(), middleware.admin()])

router.put('/products/:id', [ProductsController, 'update'])
  .as('products.update')
  .use([middleware.auth(), middleware.admin()])

// Deletar produto
router.delete('/products/:id', [ProductsController, 'destroy'])
  .as('products.destroy')
  .use([middleware.auth(), middleware.admin()])