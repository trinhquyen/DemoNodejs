const fs = require('fs')
const employee = require('../models/employee')
class NewsController {
	//GET /posts
	index(req, res) {
		try {
			const data = fs.readFileSync('./output/images/image.json', 'utf8')
			const databases = JSON.parse(data)
			databases.reverse()
			const page = req.query.page ? parseInt(req.query.page) : 1
			const totalPage = Math.ceil(databases.length / 20)
			const totalRecords = databases.length
			var dataOutput = databases
			if (page && req.query.size) {
				dataOutput = databases.splice((req.query.size) * (page - 1), req.query.size * page)
			}
			return res.status(200).json({
				code: 200,
				status: 'Success',
				data: dataOutput,
				pagination: {
					page: req.query.page ? parseInt(req.query.page) : 1,
					size: 20,
					totalPage: totalPage,
					totalRecords: totalRecords,
				}
			})
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	employee(req, res, next) {
		employee.find({}, function (err, employees) {
			if(!err) {
				return res.status(200).json({
					code: 200,
					status: 'Success',
					data: employees
				})
			}
			res.status(400).json({
				code: 400,
				status: 'error',
			})
		});
		// employee.find({})
		// 	.then(employees => {
		// 		res.status(200).json({
		// 			code: 200,
		// 			status: 'Success',
		// 			data: employees
		// 		})
		// 	})
		// 	.catch(next)
	}
	employeeDetail(req, res, next) {
		employee.findOne({id: req.params.id })
			.then(employees => {
				res.status(200).json({
					code: 200,
					status: 'Success',
					data: employees
				})
			})
			.catch(next)
	}
	create(req, res) {
		const e = new employee(req.body)
		e.save()
		res.status(200).json({
			code: 200,
			status: 'Create Success',
			data: req.body
		})
	}
	upload(req, res) {
		try {
			if(req.files)
			{
				const dataImage = fs.readFileSync('./output/images/image.json', 'utf8')
				const databasesImage = JSON.parse(dataImage)
				req.files.forEach(file => {
					databasesImage.push(`/${encodeURI(file.filename)}`,)
				})
				const dataImagePost = JSON.stringify(databasesImage)
				fs.writeFile('./output/images/image.json', dataImagePost, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			return res.status(200).json({
				code: 200,
				status: 'Success',
			})
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	delete(req, res) {
		try {
			const data = fs.readFileSync('./output/images/image.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(image => image == req.query.image)
			let path = './output/images' + req.query.image
			fs.unlink(`${path}`, function (err) {
				if (err) throw err
				console.log('File deleted!')
			})
			if (index == -1) {
				return res.status(200).json({
					code: 200,
					status: 'error',
				})
			}
			else {
				databases.splice(index, 1)
				const databasesUpdate = JSON.stringify(databases)
				fs.writeFile('./output/images/image.json', databasesUpdate, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
				return res.status(200).json({
					code: 200,
					status: 'Success',
					data: databasesUpdate,
				})
			}
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}

}
module.exports = new NewsController