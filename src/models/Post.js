const mongoose = require('mongoose')
const aws = require('aws-sdk')

// lidar com arquivos
const fs = require('fs')
// caminho ate o arquivo
const path = require('path')
// lida com a forma antiga de assincronas
const {promisify} = require('util')
// nao precisa definir as variavies pois estao no .env e ele vai procurar la
const s3 = new aws.S3()


const PostSchema = new mongoose.Schema({
    name: String, // nome original do upload
    size: Number, // tamanho
    key: String, // nome com o hash para buscar o nome completo da imagem
    url: String, // url que a imagem esta contida
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


// interceptar acoes do banco de dados (middlaware), verificar se a url esta vazia (querendo salvar no disco), se estiver vamos preencher com a url do static.
// pre('save') = antes de salvar
// function() ao inves de arrow function pois vamos precisar do 'this' e a arrow function nao permite ter acesso
PostSchema.pre('save', function() {

    if(!this.url){
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }

})


// antes de remover um post
PostSchema.pre('remove', function() {
    // remover da aws
    if(process.env.STORAGE_TYPE === 's3'){
        // console.log('s3 type')
        // .promise é tipo um await, vai esperar a promise finalizar para retornar
        return s3.deleteObject({
            Bucket: 'upload-example-rocketseat-node',
            // deletar na bucket onde a key é igual a this.key
            Key: this.key
        }).promise()
    } else {
        // remover do local
        // console.log('local typeeeee')
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key))
    }
})


module.exports = mongoose.model("Post", PostSchema)