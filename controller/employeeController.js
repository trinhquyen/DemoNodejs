const fs = require('fs')
class EmployeeController {
	index(req, res) {
		try {
			const data = fs.readFileSync('./output/employee/employee.json', 'utf8')
			const databases = JSON.parse(data)
			databases.reverse()
			const totalPage = Math.ceil(databases.length / 20)
			const totalRecords = databases.length
			const page = req.query.page ? parseInt(req.query.page) : 1
			const title = req.query.title? req.query.title.toLowerCase() : ''
			var dataOutput = databases
			if (page && req.query.size) {
				dataOutput = databases.splice((req.query.size) * (page - 1), req.query.size * page)
			}
			var dataFilter = dataOutput
			if (title) {
				dataFilter = dataOutput.filter(function (item)  {
					return item.fullName.toLowerCase().indexOf(title) > -1
				})
			}
			return res.status(200).json({
				code: 200,
				status: 'Success',
				data: dataFilter,
				pagination: {
					page: page,
					size: 20,
					totalPage: totalPage,
					totalRecords: totalRecords,
				}
			})
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	create(req, res) {
		try {
			const data = fs.readFileSync('./output/employee/employee.json', 'utf8')
			const databases = JSON.parse(data)
			let id = 0
			if (databases.length) {
				id = databases[databases.length - 1].id + 1
			}
			if (!req.file) {
				databases.push({
					id: id,
					fullName: req.body.fullName,
					email: req.body.email,
					floor: parseInt(req.body.floor),
					seat: req.body.seat,
					leader: req.body.leader,
					team: req.body.team,
					url: req.body.url,
					image: '',
					position: req.body.position,
					createAt: new Date().getTime(),
					updateAt: new Date().getTime(),
				})
			}
			else {
				databases.push({
          id: id,
					fullName: req.body.fullName,
					email: req.body.email,
					floor: parseInt(req.body.floor),
					seat: req.body.seat,
					leader: req.body.leader,
					url: req.body.url,
					team: req.body.team,
					position: req.body.position,
					image: `/${encodeURI(req.file.filename)}`? `/${encodeURI(req.file.filename)}` : '' ,
					createAt: new Date().getTime(),
					updateAt: new Date().getTime(),
				})
				const dataImage = fs.readFileSync('./output/images/image.json', 'utf8')
				const databasesImage = JSON.parse(dataImage)
				databasesImage.push(`/${encodeURI(req.file.filename)}`,)
				const dataImagePost = JSON.stringify(databasesImage)
				fs.writeFile('./output/images/image.json', dataImagePost, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			const dataPost = JSON.stringify(databases)
			fs.writeFile('./output/employee/employee.json', dataPost, 'utf8', (err) => {
				if (err) {
					console.log(`Error writing file: ${err}`)
				} else {
					console.log(`File is written successfully!`)
				}
			})

		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
		return res.send({
			code: 200,
			status: 'Success',
		})
	}
	detail(req, res) {
		try {
			const data = fs.readFileSync('./output/employee/employee.json', 'utf8')
			const databases = JSON.parse(data)
			const post = databases.find(post => post.id == req.params.id)
			if (post) {
				return res.status(200).json({
					code: 200,
					status: 'Success',
					data: post,
				})
			}
			else {
				return res.status(200).json({
					code: 200,
					status: 'Success',
					data: []
				})
			}
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	edit(req, res) {
		try {
			const data = fs.readFileSync('./output/employee/employee.json', 'utf8')
			const databases = JSON.parse(data)
			const post = databases.find(post => post.id == req.params.id)
			res.render('edit', { post: post })
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	update(req, res) {
		try {
			const data = fs.readFileSync('./output/employee/employee.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.body.id)
			const dataUpdate = {
				id: parseInt(req.body.id),
        fullName: req.body.fullName,
        email: req.body.email,
        floor: parseInt(req.body.floor),
        seat: req.body.seat,
				url: req.body.url,
        leader: req.body.leader,
        team: req.body.team,
				position: req.body.position,
				image: req.file ? `/${encodeURI(req.file.filename)}` : databases[index].image,
				createAt: databases[index].createAt,
				updateAt: new Date().getTime(),
			}
			databases.splice(index, 1, dataUpdate)
			const databasesUpdate = JSON.stringify(databases)
			fs.writeFile('./output/employee/employee.json', databasesUpdate, 'utf8', (err) => {
				if (err) {
					console.log(`Error writing file: ${err}`)
				} else {
					console.log(`File is written successfully!`)
				}
			})
			return res.status(200).json({
				code: 200,
				status: 'Success',
				data: dataUpdate,
			})
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	delete(req, res) {
		try {
			const data = fs.readFileSync('./output/employee/employee.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.query.id)
			if (index == -1) {
				return res.status(200).json({
					code: 200,
					status: 'error',
				})
			}
			else {
				databases.splice(index, 1)
				const databasesUpdate = JSON.stringify(databases)
				fs.writeFile('./output/employee/employee.json', databasesUpdate, 'utf8', (err) => {
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
module.exports = new EmployeeController
