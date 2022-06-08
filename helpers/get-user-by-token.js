const jwt = require('jsonwebtoken')

const User = require('../models/User')

// funcao para pegar o usuario pelo token (mais seguro do que pegar pela id da url)
const getUserByToken = async (token) => {

    // decodificar o token com a chave (nossosecret)
    const verificado = jwt.verify(token, 'nossosecret')

    const userId = verificado.id

    const user = await User.findOne({where: {id: userId}, raw: true})

    return user
}

module.exports = getUserByToken