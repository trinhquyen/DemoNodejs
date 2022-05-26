var express = require('express')
var router = express.Router()
const multer = require('multer')

const employeeController = require('../controller/employeeController')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'output/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })

router.post('/create', upload.single('file'), employeeController.create)
router.post('/update', upload.single('file'), employeeController.update)
router.delete('/delete', employeeController.delete)
router.get('/:id', employeeController.detail)
router.get('/', employeeController.index)
module.exports = router