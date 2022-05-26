var express = require('express')
var router = express.Router()
const multer = require('multer')

const uploadController = require('../controller/uploadController')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'output/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })
// router.get('/upload',uploadController.index)
router.post('', upload.single('file'), uploadController.upload)
module.exports = router