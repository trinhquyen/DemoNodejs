class DeployController {
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
module.exports = new DeployController
