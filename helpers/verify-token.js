const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const checkToken = (req, res, next) => {

    if(!req.headers.authorization) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    const token = getToken(req)

    if(!token) {

        return res.status(401).json({message: 'Acesso negado!'})
        
    }

    // verificar se o token realmente existe e condiz com a sessao
    try{

        const verificado = jwt.verify(token, 'nossosecret')
        req.user = verificado
        next()

    }catch{
        return res.status(400).json({message: 'Token inválido!'})
    }
}

module.exports = checkToken