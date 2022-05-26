var express = require('express')
var router = express.Router()
const multer = require('multer')

const imageController = require('../controller/imageController')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'output/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })

router.post('/upload', upload.array('files', 12), imageController.upload)
router.delete('/delete', imageController.delete)
router.post('/employee/create', upload.array('files', 12), imageController.create)
router.get('/employee/:id', imageController.employeeDetail)
router.get('/employee', imageController.employee)
router.get('/', imageController.index)
module.exports = router