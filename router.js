const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const multer = require('multer')
const upload = multer({ dest: 'upload_tmp/' })

const officePath = 'upload/office/'
const pdfPath = 'upload/pdf/'

const officeToPdf = require('./translate.js')

// 发送页面
router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, './public/index.html'), 'utf-8', (err, data) => {
        if (err) return console.log(err)
        res.send(data)
    })
})

// 上传接口
router.post('/upload', upload.any(), (req, res) => {
    let fileName = req.files[0].originalname.split('.')
    let fileSuffix = fileName[(fileName.length - 1)]
    let writeFilePath = officePath + new Date().getTime() + `.${fileSuffix}`
    fs.readFile(req.files[0].path, (err, data) => {
        fs.writeFile(writeFilePath, data, function(err) {
            if (err) throw err
            // 转换文件
            officeToPdf(writeFilePath).then(data => {
                fs.unlinkSync(req.files[0].path) // 删除缓存的文件
                res.status(200).send({ code: 200, msg: '上传成功', data: data })
            }).catch(err => {
                res.status(500).send({ code: 500, msg: err })
            })
        })
    })
})

// 读取文件夹
function handleReaddir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

// 遍历获取文件
router.get('/filelist', (req, res) => {
    handleReaddir(pdfPath).then(data => {
        let dataList = {
            code: 200,
            data: []
        }
        data.forEach(item => {
            dataList.data.push(`/${pdfPath}${item}`)
        })
        res.status(200).send(dataList)
    }).catch(err => {
        res.status(500).send({ code: 500, msg: err })
    })
})

module.exports = router