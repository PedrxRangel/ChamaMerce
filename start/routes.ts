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

// ==========================================
// ROTAS AUTENTICADAS (CLIENTES E ADMINS)
// ==========================================

router.group(() => {
  // Logout
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
  
  // Listar e ver produtos (TODOS podem)
  router.get('/products', [ProductsController, 'index']).as('products.index')
  router.get('/products/:id', [ProductsController, 'show']).as('products.show')
  
  // Perfil
  router.get('/profile/edit', [AuthController, 'editProfile']).as('profile.edit')
  router.post('/profile', [AuthController, 'updateProfile']).as('profile.update')
}).use(middleware.auth())

// ==========================================
// ROTAS APENAS ADMIN (CREATE, UPDATE, DELETE)
// ==========================================

router.group(() => {
  // Criar produto
  router.get('/products/create', [ProductsController, 'create']).as('products.create')
  router.post('/products', [ProductsController, 'store']).as('products.store')
  
  // Editar produto
  router.get('/products/:id/edit', [ProductsController, 'edit']).as('products.edit')
  router.put('/products/:id', [ProductsController, 'update']).as('products.update')
  
  // Deletar produto
  router.delete('/products/:id', [ProductsController, 'destroy']).as('products.destroy')
}).use([middleware.auth(), middleware.admin()])