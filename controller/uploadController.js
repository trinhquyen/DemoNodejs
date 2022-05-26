const path = require('path')
const fs = require('fs')
class uploadController {
	index(req, res) {
		res.render('upload')
	}
	upload(req, res) {
		try {
			const data = fs.readFileSync('./output/posts/posts.json', 'utf8')
			const databases = JSON.parse(data)
			const categoryId = req.body.categoryId ? req.body.categoryId : 0
			let id = 0
			if (databases.length) {
				id = databases[databases.length - 1].id + 1
			}
			if (!req.file) {
				databases.push({
					id: id,
					title: req.body.title,
					excerpt: req.body.excerpt,
					content: req.body.content,
					slug: req.body.slug,
					categoryId: parseInt(req.body.categoryId),
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
					excerpt: req.body.excerpt,
					slug: req.body.slug,
					content: req.body.content,
					categoryId: parseInt(req.body.categoryId),
					image: `/${encodeURI(req.file.filename)}`? `/${encodeURI(req.file.filename)}` : '' ,
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
			if (categoryId == 0) {
				const dataFilter = JSON.stringify(databases.filter(function (item) {
					return item.categoryId == 0
				}))
				fs.writeFile('./output/posts/technologyPosts.json', dataFilter, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			else if (categoryId == 1) {
				const dataFilter = JSON.stringify(databases.filter(function (item) {
					return item.categoryId == 1
				}))
				fs.writeFile('./output/posts/timebirdPosts.json', dataFilter, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			else {
				const dataFilter = JSON.stringify(databases.filter(function (item) {
					return item.categoryId == 2
				}))
				fs.writeFile('./output/posts/productPosts.json', dataFilter, 'utf8', (err) => {
					if (err) {
						console.log(`Error writing file: ${err}`)
					} else {
						console.log(`File is written successfully!`)
					}
				})
			}
			const dataPost = JSON.stringify(databases)
			fs.writeFile('./output/posts/posts.json', dataPost, 'utf8', (err) => {
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
}
module.exports = new uploadController