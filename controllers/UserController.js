const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    static async registro(req, res) {
        const {name, email, password, cell, state, confirmpassword} = req.body

        // validações
        if(!name) {
            // status de erro
            res.status(422).json({message: 'O nome é obrigatório!'})

            return
        }
        if(!email) {
            // status de erro
            res.status(422).json({message: 'O e-mail é obrigatório!'})

            return
        }
        if(!password) {
            // status de erro
            res.status(422).json({message: 'A senha é obrigatório!'})

            return
        }
        if(!confirmpassword) {
            // status de erro
            res.status(422).json({message: 'A confirmação da senha é obrigatório!'})

            return
        }
        if(!state) {
            // status de erro
            res.status(422).json({message: 'O estado é obrigatório!'})

            return
        }
        if(!cell) {
            // status de erro
            res.status(422).json({message: 'O telefone é obrigatório!'})

            return
        }
        if(password !== confirmpassword) {
             // status de erro
             res.status(422).json({message: 'As senhas não batem!'})

             return
        }

        // checar se o usuário existe
        const verificar = await User.findOne({where:{email: email}})

        if(verificar) {
            // status de erro
            res.status(422).json({message: 'Já existe um usuário com esse e-mail!'})

            return
        }

        // criar senha (criptografar)
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        // criar usuário
        const agronomo = false

        const user = {
            name,
            email,
            password: hashedPassword,
            state,
            cell,
            agronomo
        }

        try{

            const novoUser = await User.create(user)

            await createUserToken(novoUser, req, res)

        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async login(req, res) {

        const {email, password} = req.body

        if(!email) {
            // status de erro
            res.status(422).json({message: 'O e-mail é obrigatório!'})

            return
        }

        if(!password) {
            // status de erro
            res.status(422).json({message: 'A senha é obrigatória!'})

            return
        }

        const user = await User.findOne({where: {email: email}})

        if(!user) {
            res.status(422).json({
                message: 'Não há usuário cadastrado com esse email!'
            })

            return
        }

        // checar se a senha fornecida confere com a senha do banco de dados
        const checarPassword = await bcrypt.compare(password, user.password)

        if(!checarPassword) {
            res.status(422).json({
                message: 'Senha incorreta!'
            })

            return
        }

        await createUserToken(user, req, res)
    }

    // funcao para checar o usuario logado e pegar suas informações
    static async checarUsuario(req, res) {

        let usuarioAtual

        if(req.headers.authorization) {

            const token = getToken(req)

            // Código para decodificar o token
            const decoded = jwt.verify(token, 'nossosecret')

            usuarioAtual = await User.findOne({where: {id: decoded.id}})

            usuarioAtual.password = undefined

        } else {
            usuarioAtual = null
        }

        res.status(200).send(usuarioAtual)
    }

    static async pegarUserId(req, res) {
        
        // pegar o id pela url
        const id = req.params.id

        // tentar retirar password desse objeto
        const user = await User.findOne({where: {id: id}})

        if(!user) {
            res.status(422).json({
                message: 'Usuário não encontrado!',
            })

            return
        }

        res.status(200).json({user})
    }

    static async editarUser(req, res) {
        //const id = req.params.id
        // checar se usuário existe
        const token = getToken(req)

        const user = await getUserByToken(token)

        const {name, email, cell, state, password, confirmpassword} = req.body

        // validações
        if(!name) {
            // status de erro
            res.status(422).json({message: 'O nome é obrigatório!'})

            return
        }

        user.name = name

        if(!email) {
            // status de erro
            res.status(422).json({message: 'O e-mail é obrigatório!'})

            return
        }

        

        // checar se já existe alguém cadastrado com esse email
        const userE = await User.findOne({where: {email: email}})

        if(user.email !== email && userE) {
            res.status(422).json({
                message: 'Utilize outro e-mail!'
            })

            return
        }

        user.email = email

        if(!cell) {
             // status de erro
            res.status(422).json({message: 'O telefone é obrigatório!'})

             return
        }

        user.cell = cell

        if(!state) {
            // status de erro
            res.status(422).json({message: 'O estado é obrigatório!'})

            return
        }

        user.state = state

        user.agronomo = false

        if(password != confirmpassword) {
            // status de erro
            res.status(422).json({message: 'As senhas não batem!'})

            return
        }else if(password === confirmpassword && password != null) {

            // criar senha
            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(password, salt)

            // alterando a senha
            user.password = hashedPassword
        }

        try {

            const updatedUser = await User.update(user, {where: {id: user.id}})

            console.log(user)
            console.log(updatedUser)

            res.status(200).json({
                message: 'Usuário atualizado!',
                updatedUser
            })
            
        } catch (err) {
            res.status(500).json({
                message: err
            })
            return
        }

    }

    /*static pegarUser(req, res) {

        const user = 

    }*/
}