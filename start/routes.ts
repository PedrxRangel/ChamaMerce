import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const CartsController = () => import('#controllers/carts_controller')
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

// Rotas do carrinho (usuários autenticados)
router.get('/cart', [CartsController, 'index'])
  .as('cart.index')
  .use(middleware.auth())

router.post('/cart/add/:id', [CartsController, 'add'])
  .as('cart.add')
  .use(middleware.auth())

router.post('/cart/remove/:id', [CartsController, 'remove'])
  .as('cart.remove')
  .use(middleware.auth())

router.post('/cart/increase/:id', [CartsController, 'increaseQuantity'])
  .as('cart.increase')
  .use(middleware.auth())

router.post('/cart/decrease/:id', [CartsController, 'decreaseQuantity'])
  .as('cart.decrease')
  .use(middleware.auth())

router.post('/cart/clear', [CartsController, 'clear'])
  .as('cart.clear')
  .use(middleware.auth())
router.group(() => {
  // Logout
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
  
  // Lista de produtos (Índice)
  router.get('/products', [ProductsController, 'index']).as('products.index')
  
  // Perfil
  router.get('/profile/edit', [AuthController, 'editProfile']).as('profile.edit')
  router.post('/profile', [AuthController, 'updateProfile']).as('profile.update')

// ==========================================
// ROTAS APENAS ADMIN (CREATE, UPDATE, DELETE)
// (Este grupo deve vir antes da rota dinâmica show)
// ==========================================

// Rotas exclusivas de Admin
  router.group(() => {
    // Criar produto (Rota ESPECÍFICA: /products/create)
    router.get('/products/create', [ProductsController, 'create']).as('products.create')
    router.post('/products', [ProductsController, 'store']).as('products.store')
    
    // Editar produto (Rotas ESPECÍFICAS com ID, mas com /edit no final)
    router.get('/products/:id/edit', [ProductsController, 'edit']).as('products.edit')
    router.put('/products/:id', [ProductsController, 'update']).as('products.update')
    
    // Deletar produto
    router.delete('/products/:id', [ProductsController, 'destroy']).as('products.destroy')
  }).use(middleware.admin()) // Aplica apenas o middleware 'admin' a este subgrupo
  
  // Rota Dinâmica de VISUALIZAÇÃO (DEVE VIR POR ÚLTIMO)
  // Se o caminho não casar com '/products', '/products/create', ou '/products/:id/edit',
  // ele cairá aqui, capturando qualquer ID válido.
  router.get('/products/:id', [ProductsController, 'show']).as('products.show')

}).use(middleware.auth()) // Aplica o middleware 'auth' ao grupo principal

// NOTE: A rota show foi movida para o final do grupo 'auth()' para garantir que 
// a rota 'create' e 'edit' (que são mais específicas) sejam verificadas primeiro.