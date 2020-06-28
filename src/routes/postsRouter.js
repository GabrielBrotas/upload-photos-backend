const router = require('express').Router()
const multer = require('multer');
const multerConfig = require('../config/multerConfig')

const Post = require('../models/Post')

// multer é um middleware que vai permitir o envio de arquivos, entre os parenteses vai a config del e
// depois do '.' vamos definir o arquivo se é single(apenas um), array (multiplos arquivos), entre outros
router.post('/', multer(multerConfig).single('file') , async (req, res) => {
    
    const {originalname: name, size, key, location: url = ''} = req.file

    // console.log(req.file)
    const post = await Post.create({
        name,
        size,
        key,
        url ,
    })

    return res.json(post)
})

// listagem das fotos
router.get('/', async (req, res) => {
    const posts = await Post.find({});

    return res.json(posts)
})

router.delete('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);

    await post.remove()

    return res.send()
    
})


module.exports = router