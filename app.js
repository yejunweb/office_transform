const util = require('util')
const process = require('child_process')

var exec = util.promisify(process.exec)

// office translate
async function officeToPdf(enterPath, outputPath) {
    const { stdout, stderr } = await exec(
        // 'soffice --headless --convert-to pdf ' + wordPath
        'soffice --headless --convert-to pdf --outdir ' + outputPath + ' ' + enterPath
    )
    console.log('stdout:', stdout)
    console.log('stderr:', stderr)
}

// officeToPdf(path.join(__dirname, './src/office/1611135308658.doc'), path.join(__dirname, './src/pdf/'))

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 开放目录
app.use('/', express.static('./'))

app.listen(3000, () => {
    console.log('http://localhost:3000')
})

// 分离路由
const router = require('./router.js')
app.use(router)