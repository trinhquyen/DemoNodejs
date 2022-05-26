const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const port = 3000
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const route = require('./routes')
// connect db
const db = require('./config/db')
db.connect();

app.use(express.urlencoded(
  {
    extended: true
  }
))
app.use(express.json())
app.use(morgan('combined'))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.use(express.static("output/images"))
app.set('views', path.join(__dirname,'/views'))

var cors = require('cors')

app.use(cors())
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
//CREATE EXPRESS APP
app.use(bodyParser.urlencoded({extended: true}))
route(app)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

