const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

// provider para o multer que vai permitir fazer o storage na aws ao inves do local
const multerS3 = require('multer-s3')

// tem toda sdk da amazon, configuração com o node e integração com a api da aws e fazer a integração com o s3
const aws = require('aws-sdk')

// tipos de storage 
const storageTypes = {

    // tipo local (para ambiente de desenvolvimento)
    local: multer.diskStorage({
        // destino novamente
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        // evitar nome repetido colocando um hash na frente do nome
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                // caso der algum erro vamos trata-lo no cb
                if(err) cb(err);
                // console.log(file)
                // se nao tiver erro.. mudar o nome da imagem com hash na frente
                file.key = `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
        }
    }),
    // ambiente de produção
    s3: multerS3({
        // variavel obrigatoria, vai pegear as variaveis do .env
        s3: new aws.S3(),
        // nome do bucket criado
        bucket: 'upload-example-rocketseat-node',
        // vai abrir o navegador em tela ao inves de forçar o download
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // os arquivos sejam publico para leitura
        acl: 'public-read',
        // nome da imagem que vai ser gravada no s3
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                // caso der algum erro vamos trata-lo no cb
                if(err) cb(err);
                // console.log(file)
                // se nao tiver erro.. mudar o nome da imagem com hash na frente
                const filename = `${hash.toString('hex')}-${file.originalname}.jpg`

                cb(null, filename)
            })
        }
    })

}


module.exports ={ 
    // destino para onde os arquivos vao depois que efizeer o upload
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    
    // local ou s3
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        // limite no tamanho do arquivo
        fileSize: 2 * 1024 * 1024, // 2mb
    },
    // funcao para filtrar upload de arquivos, ex: apenas arquivos jpg ou png
    // aceita 3 parametros, 
        //req = para pegar dados do body, header, params, etc;
        //file = o arquivo onde vamos pegar o nome e os dados;
        //cb = callback/função quando terminar a verificação 
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/pjpeg',
            'image/png',
            'image/gif',
        ]

        // se o arquivo passado estiver na lista de arquivos permitidos
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            // se nao mandar um erro
            cb(new Error('invalid file type.'))
        }
    }
}