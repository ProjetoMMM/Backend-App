const getToken = (req) => {

    const authHeader = req.headers.authorization

    // splita o string que vem do token em dois ('bearer' 'token') e pega o segundo elemento ('token')
    const token = authHeader.split(" ")[1]

    return token
}

module.exports = getToken