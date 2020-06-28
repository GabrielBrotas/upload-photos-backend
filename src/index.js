// fazer uso das variaveis ambientes
require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const path = require('path')

const morgan = require('morgan') // fazer log de requisições http
const multer = require('multer') // requisições de multiplatform, permite trazer arquivos
const cors = require('cors') // cors vai permitir requisições de outro servidor/url, no nosso caso que vamos pegar dados da porta :3000

// rotas
const posts = require('./routes/postsRouter')


// configs
    app.use(cors())
    app.use(express.json()) // lidar com formatos json
    app.use(express.urlencoded({extended: true})) // lidar com requisições do tipo url
    app.use(morgan('dev'))

    // static do express
    // sempre que formos acessar uma rota /files / alguma coisa, ele vai tentar encontrar o arquivo dentro da pasta /tmp/uploads, ex :http://localhost:8081/files/6f572025c178ccb642f30d2a76f983d2-acessorio1.jpg.jpg
    app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

    // database
    // 27017 = porta default do mongodb
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then( () => {
        console.log('conectado ao DB')
    }).catch( err => {
        console.log('erro ao se conectar com o db: ' + err)
    })

    // bodyparser
    app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('helelo')
})

app.use('/posts', posts)

// Porta que o heroku vai gerar ou a do localhost
const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log('API running in http://localhost:8081')
})