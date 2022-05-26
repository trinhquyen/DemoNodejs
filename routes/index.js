const uploadRouter = require('./upload')
const postsRouter = require('./posts')
const imageRouter = require('./image')
const recruitmentRouter = require('./recruitment')
const employeeRouter = require('./employee')


function route(app) {
	app.use('/upload', uploadRouter)
	app.use('/posts', postsRouter)
	app.use('/list-image', imageRouter)
	app.use('/recruitment', recruitmentRouter)
	app.use('/employee', employeeRouter)
	app.use('/', uploadRouter)
}
module.exports = route