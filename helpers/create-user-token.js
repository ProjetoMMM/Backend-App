const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    const token = jwt.sign({

        // criar o token
        name: user.name,
        id: user.id
    }, 'nossosecret')

    // retornar o token
    res.status(200).json({
        message: 'Você está autenticado!',
        token: token,
        userId: user.id,
    })
}

module.exports = createUserToken