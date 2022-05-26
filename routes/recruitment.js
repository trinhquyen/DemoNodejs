var express = require('express')
const multer = require('multer')
var router = express.Router()
const recruitmentController = require('../controller/recruitmentController')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'output/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })
router.post('/create', upload.single('file'), recruitmentController.upload)
router.post('/edit', upload.single('file'), recruitmentController.update)
router.post('/change-status', recruitmentController.changeStatus)
router.delete('/delete', recruitmentController.delete)
router.get('/:id', recruitmentController.detail)
router.post('/call', recruitmentController.callScript)
router.get('/', recruitmentController.index)
module.exports = router