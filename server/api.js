var formidable = require('formidable');
var multer = require('multer');
const express = require('express');
const config = require('./config');
let router = express.Router();
const folder = './public/pdf/';
const fs = require('fs');
const Tesseract = require('tesseract.js');
var PDFImage = require("pdf-image").PDFImage;
//GET LIST OF FILES //
function getFiles(dir) {
    fileList = [];

    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        var new_dir = '';
        for (var j = 2; j < dir.split('/').length; j++) {
            new_dir = new_dir + '/' + dir.split('/')[j];
        }
        var path = '.' + new_dir + '/' + files[i];
        if (!fs.statSync(name).isDirectory()) {
            fileList.push(path);
        }
    }
    return JSON.stringify(fileList);
}

//upload
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        // fs.mkdir(folder, err => cb(err, folder));
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + file.originalname);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

//API
router.get('/', function (req, res) {
    //res.send('PDF get API ok!');
    res.send(getFiles(folder));
});

/**
 * @description: upload file to server
 *
 */
router.post('/upload', function (req, res) {
    //TODO: Return url of pdf
    upload(req, res, function (err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            console.log(err);
            return;
        }
        res.json({
            error_code: 0,
            err_desc: null,
            msg: folder + req.file.filename
        });
        console.log("uploaded file: " + req.file.filename);
    });
});

router.get('/ocr', function (req, res) {
    try {
        var lang = req.query.lang;
        var filename = req.query.url;
        console.log(filename);
        console.log(lang);
        const {
            TesseractWorker,
            utils: {
                loadLang
            }
        } = Tesseract;
        const worker = new TesseractWorker();
        loadLang({
                langs: lang,
                langPath: worker.options.langPath
            })
            .then(() => {
                worker
                    .recognize(filename, lang)
                    .progress(p => console.log(p))
                    .then(({
                        text
                    }) => {
                        console.log(text);
                        res.send(text);
                        worker.terminate();
                    });
            });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            msg: err.message
        });
    }
})



module.exports = router;