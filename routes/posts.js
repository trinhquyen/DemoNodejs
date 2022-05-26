var express = require('express')
const multer = require('multer')
var router = express.Router()
const postsController = require('../controller/postsController')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'output/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })
router.post('/edit', upload.single('file'), postsController.update)
router.post('/change-status', postsController.changeStatus)
router.delete('/delete', postsController.delete)
router.get('/product-list', postsController.product)
router.get('/time-bird-list', postsController.timebird)
router.get('/technology-list', postsController.technology)
router.get('/:id', postsController.detail)
router.get('/', postsController.index)
module.exports = router