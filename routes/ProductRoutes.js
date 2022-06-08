const router = require('express').Router()

const ProductController = require('../controllers/ProductController')

// middlewares
const verifyToken = require('../helpers/verify-token')

router.post('/criar', ProductController.criar)
router.get('/', ProductController.getAll)
router.get('/meusprodutos', verifyToken, ProductController.getAllUserProducts)
router.delete('/:id', verifyToken, ProductController.removerProduct)
router.patch('/:id', verifyToken, ProductController.editarProduct)
// rota para aceitar a requisição do agrônomo
router.patch('/pegar/:id', verifyToken, ProductController.pegar)    

module.exports = router