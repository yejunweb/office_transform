const process = require('child_process')
const { rejects } = require('assert')
const outputPath = 'upload/pdf/'

// office translate
module.exports = function(enterPath) {
    return new Promise((resolve, reject) => {
        process.exec('soffice --headless --convert-to pdf --outdir ' + outputPath + ' ' + enterPath, (err, stdout, stderr) => {
            if (err || stderr) return reject(err || stderr)
            resolve(stdout)
        })
    })
}