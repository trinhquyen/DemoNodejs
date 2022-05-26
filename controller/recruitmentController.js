const fs = require('fs')
class NewsController {
	index(req, res) {
		try {
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
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
				if (req.query.time) {
					const startTime = parseInt(req.query.time[0])
					const endTime = parseInt(req.query.time[1]) + 86400000
					dataFilter = dataOutput.filter(function (item) {
						return item.createAt > startTime && item.createAt < endTime && item.title.toLowerCase().indexOf(title) > -1
					})
				}
				else {
					dataFilter = dataOutput.filter(function (item) {
						return item.title.toLowerCase().indexOf(title) > -1
					})
				}
			}
			else {
				if (req.query.time) {
					dataFilter = dataOutput.filter(function (item) {
						return item.createAt > req.query.time[0] && item.createAt < req.query.time[1]
					})
				}
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
	upload(req, res) {
		try {
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
			const databases = JSON.parse(data)
			let id = 0
			if (databases.length) {
				id = databases[databases.length - 1].id + 1
			}
			if (!req.file) {
				databases.push({
					id: id,
					title: req.body.title,
					salary: req.body.salary,
					slug: req.body.slug,
					location: req.body.location,
					time: req.body.time,
					content: req.body.content,
					status: req.body.status == 'true' ? true : false,
					createAt: new Date().getTime(),
					updateAt: new Date().getTime(),
					url: req.body.url
				})
			}
			else {
				databases.push({
					id: id,
					title: req.body.title,
					salary: req.body.salary,
					slug: req.body.slug,
					location: req.body.location,
					time: req.body.time,
					content: req.body.content,
					image: `/${encodeURI(req.file.filename)}`,
					status: req.body.status == 'true' ? true : false,
					createAt: new Date().getTime(),
					updateAt: new Date().getTime(),
					url: req.body.url
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
			fs.writeFile('./output/jobs/recruitment.json', dataPost, 'utf8', (err) => {
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
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
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
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
			const databases = JSON.parse(data)
			const post = databases.find(post => post.id == req.params.id)
			res.render('edit', { post: post })
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	update(req, res) {
		try {
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.body.id)
			const dataUpdate = {
				id: parseInt(req.body.id),
				title: req.body.title,
				excerpt: req.body.excerpt,
				slug: req.body.slug,
				time: req.body.time,
				content: req.body.content,
				location: req.body.location,
				salary: req.body.salary,
				status: req.body.status == 'true' ? true : false,
				url: req.body.url,
				image: req.file ? `/${encodeURI(req.file.filename)}` : databases[index].image,
				createAt: databases[index].createAt,
				updateAt: new Date().getTime(),
			}
			databases.splice(index, 1, dataUpdate)
			const databasesUpdate = JSON.stringify(databases)
			fs.writeFile('./output/jobs/recruitment.json', databasesUpdate, 'utf8', (err) => {
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
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
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
				fs.writeFile('./output/jobs/recruitment.json', databasesUpdate, 'utf8', (err) => {
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
	changeStatus(req, res) {
		try {
			const data = fs.readFileSync('./output/jobs/recruitment.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.body.id)
			const dataUpdate = {
				id: databases[index].id,
				title: databases[index].title,
				excerpt: databases[index].excerpt,
				slug: databases[index].slug,
				status: req.body.status,
				content: databases[index].content,
				url: databases[index].url,
				image: databases[index].image,
				createAt: databases[index].createAt,
				updateAt: new Date().getTime(),
			}
			databases.splice(index, 1, dataUpdate)
			const databasesUpdate = JSON.stringify(databases)
			fs.writeFile('./output/jobs/recruitment.json', databasesUpdate, 'utf8', (err) => {
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
	callScript(req, res) {
		const shell = require('shelljs')
		const { dirname } = require('path')
		const appDir = dirname(require.main.filename)
		shell.exec(`${appDir}/deploy.sh`)
		return res.status(200).json({
			code: 200,
			status: 'Success',
		})
	}
}
module.exports = new NewsController
