const fs = require('fs')
class NewsController {
	index(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
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
					const startTime = parseInt(req.query.time[0])
					const endTime = parseInt(req.query.time[1]) + 86400000
					dataFilter = dataOutput.filter(function (item) {
						return item.createAt > startTime && item.createAt < endTime
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
	product(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/productPosts.json', 'utf8')
			const databases = JSON.parse(data)
			databases.reverse()
			const totalPage = Math.ceil(databases.length / 20)
			const totalRecords = databases.length
			const page = req.query.page ? parseInt(req.query.page) : 1
			var dataOutput = databases
			if (page && req.query.size) {
				dataOutput = databases.splice((req.query.size) * (page - 1), req.query.size * page)
			}
			return res.status(200).json({
				code: 200,
				status: 'Success',
				data: dataOutput,
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
	timebird(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/timebirdPosts.json', 'utf8')
			const databases = JSON.parse(data)
			databases.reverse()
			const totalPage = Math.ceil(databases.length / 20)
			const totalRecords = databases.length
			const page = req.query.page ? parseInt(req.query.page) : 1
			var dataOutput = databases
			if (page && req.query.size) {
				dataOutput = databases.splice((req.query.size) * (page - 1), req.query.size * page)
			}
			return res.status(200).json({
				code: 200,
				status: 'Success',
				data: dataOutput,
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
	technology(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/technologyPosts.json', 'utf8')
			const databases = JSON.parse(data)
			databases.reverse()
			const totalPage = Math.ceil(databases.length / 20)
			const totalRecords = databases.length
			const page = req.query.page ? parseInt(req.query.page) : 1
			var dataOutput = databases
			if (page && req.query.size) {
				dataOutput = databases.splice((req.query.size) * (page - 1), req.query.size * page)
			}
			return res.status(200).json({
				code: 200,
				status: 'Success',
				data: dataOutput,
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
	detail(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
			const databases = JSON.parse(data)
			const post = databases.find(post => post.id == req.params.id)
			const index = databases.findIndex(post => post.id == req.params.id)
			const listRelatedPosts = []
			if (index == 0) {
				listRelatedPosts.push(databases[index + 1])
			}
			else if (index == (databases.length - 1)) {
				listRelatedPosts.push(databases[index - 1])
			}
			else {
				listRelatedPosts.push(databases[index + 1])
				listRelatedPosts.push(databases[index - 1])
			}
			post.listRelatedPosts = listRelatedPosts
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
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
			const databases = JSON.parse(data)
			const post = databases.find(post => post.id == req.params.id)
			res.render('edit', { post: post })
		} catch (err) {
			console.log(`Error reading file from disk: ${err}`)
		}
	}
	update(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.body.id)
			const categoryId = req.body.categoryId
			const dataUpdate = {
				id: parseInt(req.body.id),
				title: req.body.title,
				excerpt: req.body.excerpt,
				slug: req.body.slug,
				content: req.body.content,
				categoryId: parseInt(req.body.categoryId),
				status: req.body.status == 'true' ? true : false,
				url: req.body.url,
				image: req.file ? `/${encodeURI(req.file.filename)}` : databases[index].image,
				createAt: databases[index].createAt,
				updateAt: new Date().getTime(),
			}
			if(req.file)
			{
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
			databases.splice(index, 1, dataUpdate)
			const databasesUpdate = JSON.stringify(databases)
			fs.writeFile('./output/posts/posts.json', databasesUpdate, 'utf8', (err) => {
				if (err) {
					console.log(`Error writing file: ${err}`)
				} else {
					const dataTechnologyFilter = JSON.stringify(databases.filter(function (item) {
						return item.categoryId == 0
					}))
					fs.writeFile('./output/posts/technologyPosts.json', dataTechnologyFilter, 'utf8', (err) => {
						if (err) {
							console.log(`Error writing file: ${err}`)
						} else {
							console.log(`File is written successfully!`)
						}
					})
					const dataTimeBirdFilter = JSON.stringify(databases.filter(function (item) {
						return item.categoryId == 1
					}))
					fs.writeFile('./output/posts/timebirdPosts.json', dataTimeBirdFilter, 'utf8', (err) => {
						if (err) {
							console.log(`Error writing file: ${err}`)
						} else {
							console.log(`File is written successfully!`)
						}
					})
					const dataProductFilter = JSON.stringify(databases.filter(function (item) {
						return item.categoryId == 2
					}))
					fs.writeFile('./output/posts/productPosts.json', dataProductFilter, 'utf8', (err) => {
						if (err) {
							console.log(`Error writing file: ${err}`)
						} else {
							console.log(`File is written successfully!`)
						}
					})
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
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.query.id)
			const categoryId = databases[index].categoryId
			if (index == -1) {
				return res.status(200).json({
					code: 200,
					status: 'error',
				})
			}
			else {
				if (categoryId == 0) {
					const dataTechnology = fs.readFileSync('./output/posts/technologyPosts.json', 'utf8')
					const databasesTechnology = JSON.parse(dataTechnology)
					const index = databasesTechnology.findIndex(post => post.id == req.query.id)
					databasesTechnology.splice(index, 1)
					const databasesTechnologyUpdate = JSON.stringify(databasesTechnology)
					fs.writeFile('./output/posts/technologyPosts.json', databasesTechnologyUpdate, 'utf8', (err) => {
						if (err) {
							console.log(`Error writing file: ${err}`)
						} else {
							console.log(`File is written successfully!`)
						}
					})
				}
				else if (categoryId == 1) {
					const dataTimeBird = fs.readFileSync('./output/posts/timebirdPosts.json', 'utf8')
					const databasesTimeBird = JSON.parse(dataTimeBird)
					const index = databasesTimeBird.findIndex(post => post.id == req.query.id)
					databasesTimeBird.splice(index, 1)
					const databasesTimeBirdUpdate = JSON.stringify(databasesTimeBird)
					fs.writeFile('./output/posts/timebirdPosts.json', databasesTimeBirdUpdate, 'utf8', (err) => {
						if (err) {
							console.log(`Error writing file: ${err}`)
						} else {
							console.log(`File is written successfully!`)
						}
					})
				}
				else {
					const dataProduct = fs.readFileSync('./output/posts/productPosts.json', 'utf8')
					const databasesProduct = JSON.parse(dataProduct)
					const index = databasesProduct.findIndex(post => post.id == req.query.id)
					databasesProduct.splice(index, 1)
					const databasesProductUpdate = JSON.stringify(databasesProduct)
					fs.writeFile('./output/posts/productPosts.json', databasesProductUpdate, 'utf8', (err) => {
						if (err) {
							console.log(`Error writing file: ${err}`)
						} else {
							console.log(`File is written successfully!`)
						}
					})
				}
				databases.splice(index, 1)
				const databasesUpdate = JSON.stringify(databases)
				fs.writeFile('./output/posts/posts.json', databasesUpdate, 'utf8', (err) => {
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
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
			const databases = JSON.parse(data)
			const index = databases.findIndex(post => post.id == req.body.id)
			const categoryId = databases[index].categoryId
			const dataUpdate = {
				id: databases[index].id,
				title: databases[index].title,
				slug: databases[index].slug,
				excerpt: databases[index].excerpt,
				status: req.body.status,
				content: databases[index].content,
				category: databases[index].category,
				url: databases[index].url,
				image: databases[index].image,
				createAt: databases[index].createAt,
				updateAt: new Date().getTime(),
			}
			if (categoryId == 0) {
				const dataTechnology = fs.readFileSync('./output/posts/technologyPosts.json', 'utf8')
				const databasesTechnology = JSON.parse(dataTechnology)
				const index = databasesTechnology.findIndex(post => post.id == req.body.id)
				databasesTechnology.splice(index, 1, dataUpdate)
				const databasesTechnologyUpdate = JSON.stringify(databasesTechnology)
				fs.writeFile('./output/posts/technologyPosts.json', databasesTechnologyUpdate, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			else if (categoryId == 1) {
				const dataTimeBird = fs.readFileSync('./output/posts/timebirdPosts.json', 'utf8')
				const databasesTimeBird = JSON.parse(dataTimeBird)
				const index = databasesTimeBird.findIndex(post => post.id == req.body.id)
				databasesTimeBird.splice(index, 1, dataUpdate)
				const databasesTimeBirdUpdate = JSON.stringify(databasesTimeBird)
				fs.writeFile('./output/posts/timebirdPosts.json', databasesTimeBirdUpdate, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			else {
				const dataProduct = fs.readFileSync('./output/posts/productPosts.json', 'utf8')
				const databasesProduct = JSON.parse(dataProduct)
				const index = databasesProduct.findIndex(post => post.id == req.body.id)
				databasesProduct.splice(index, 1, dataUpdate)
				const databasesProductUpdate = JSON.stringify(databasesProduct)
				fs.writeFile('./output/posts/productPosts.json', databasesProductUpdate, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			databases.splice(index, 1, dataUpdate)
			const databasesUpdate = JSON.stringify(databases)
			fs.writeFile('./output/posts/posts.json', databasesUpdate, 'utf8', (err) => {
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
}
module.exports = new NewsController