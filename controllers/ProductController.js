const Product = require('../models/Product')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const User = require('../models/User')

module.exports = class ProductController{
    
    // criar um produto
    static async criar(req, res) {
        const {pname, pqty, UserId} = req.body

        const reqst = false

        // validações
        if(!pname){
            res.status(422).json({message: 'O nome é obrigatório!'})

            return
        }
        if(!pqty){
            res.status(422).json({message: 'A quantidade é obrigatória!'})

            return
        }

        // pegar usuário
        //const token = getToken(req)
        //const user = await getUserByToken(token)



        // criar objeto
        const product = {
            pname,
            pqty,
            reqst,
            UserId
        }

        console.log(product)

        try {
            const novoProduct = await Product.create(product)
            res.status(201).json({
                message: 'Produto cadastrado com sucesso!',
                novoProduct
            })

        } catch (error) {

            res.status(500).json({message: error})

        }
    }

    static async getAll(req, res) {

        const products = await Product.findAll({where: {reqst: true}, attributes: ['pname', 'pqty']})//, order: [['updatedAt', 'DESC']]

        res.status(200).json({
            products,
        })

    }

    static async getAllUserProducts(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const products = await Product.findAll({where: {UserId: user.id},order: [['updatedAt', 'DESC']]})

        res.status(200).json({
            products, 
        })

    }

    static async removerProduct(req, res) {

        const id = req.params.id

        // checar se id realmente existe
        const checar = await Product.findOne({where: {id: id}})

        if(!checar) {
            res.status(422).json({
                message: "Esse produto não existe"
            })

            return
        }

        // checar se o usuário logado registrou o produto que vai deletar
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(checar.UserId !== user.id){
            res.status(422).json({
                message: "Ocorreu um erro!"
            })

            return
        }

        const destroy = await Product.destroy({where: {id: id, UserId: user.id}})

        if(!destroy){
            res.status(422).json({
                message: "Ocorreu um erro!"
            })

            return
        }

        res.status(200).json({
            message: 'Produto removido com sucesso!'
        })
    }

    static async editarProduct(req, res) {
        
        const id = req.params.id

        const {pname, pqty} = req.body

        const dadosAtualizados = {}

        // checar se esse produto realmente existe
        const product = await Product.findOne({where: {id: id}})

        if(!product) {
            res.status(404).json({
                message: 'Esse produto não existe'
            })

            return
        }

        // checar se o usuário logado é dono do produto
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(product.UserId !== user.id) {
            res.status(422).json({
                message: 'Ocorreu um erro!'
            })

            return
        }

        // validações
        if(!pname){
            res.status(422).json({message: 'O nome é obrigatório!'})

            return
        }else{
            dadosAtualizados.pname = pname
        }
        if(!pqty){
            res.status(422).json({message: 'A quantidade é obrigatória!'})

            return
        }else{
            dadosAtualizados.pqty = pqty
        }

        dadosAtualizados.reqst = false

        const update = await Product.update(dadosAtualizados, {where: {id: id}})

        res.status(200).json({
            message: 'Produto atualizado com sucesso!'
        })
    }

    static async pegar(req, res) {

        const id = req.params.id

        // checar se a requisição existe
        const product = await Product.findOne({where: {id: id, reqst: true}})

        if(!product) {
            res.status(404).json({
                message: 'Essa requisição não existe'
            })

            return
        }

        // checar se a requisição já foi aceita
        const token = getToken(req)
        const usuario = await getUserByToken(token)

        const dadosprodutos = await Product.findOne({where: {id: id}, raw: true})
        //const dadosuser = await User.findOne({where: {id: dadosprodutos.UserId}, raw: true})

        if(dadosprodutos.aceito){
            if(dadosprodutos.aceito === usuario.name){
                res.status(422).json({
                    message: 'Você já aceitou essa requisição!'
                })

                return
            }
            else{
                res.status(422).json({
                    message: 'Outro agricultor já aceitou essa requisição!'
                })

                return
            }
        }

        // pegar requisição (botar o nome do usuario no "aceito" do banco de dados)
        dadosprodutos.aceito = usuario.name

        const update = await Product.update(dadosprodutos, {where: {id: id}})

        res.status(200).json({
            message: 'Você aceitou essa requisição!'
        })
    }
}