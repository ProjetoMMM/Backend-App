const router = require('express').Router()

const UserController = require('../controllers/UserController')

// middleware de verificar se o usuario possui um token (está realmente logado)
const verifyToken = require('../helpers/verify-token')


//router.get('/inicio', UserController.inicio)
router.post('/registro', UserController.registro)
router.post('/login', UserController.login)
router.get('/checarusuario', UserController.checarUsuario)
router.get('/:id', UserController.pegarUserId)
router.patch('/edit/:id', verifyToken, UserController.editarUser)
router.post('/redefinir', UserController.redefinir)
router.get('/mostrar', UserController.mostrar)

module.exports = router