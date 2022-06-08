const express = require('express')
const cors = require('cors')

const UserRoutes = require('./routes/UserRoutes')
const ProductRoutes = require('./routes/ProductRoutes')

const app = express()

// Configurar resposta JSON
app.use(express.json())

// Resolver o erro de acessar a API pelo mesmo domínio
app.use(cors({credentials: true, origin: 'http://localhost:8100'}))

// Rotas
app.use('/users', UserRoutes)
app.use('/products', ProductRoutes)

app.listen(5000)