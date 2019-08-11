// Import other required libraries
const util = require('util');
var formidable = require('formidable');
var multer = require('multer');
const express = require('express');
const config = require('./config');
let router = express.Router();
const folder = './../Client/public/pdf/';
const fs = require('fs');
const Tesseract = require('tesseract.js');
const PDFParser = require("pdf2json");
const pdf = require('pdf-parse');
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

//GET VOICE FROM TEXT//
const textToSpeech = require('@google-cloud/text-to-speech');
async function getVoice(text, language, outputFilename) {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();
    if (text === undefined) {
        text = "hello world";
    }
    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML Voice Gender (optional)
        voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    var now = new Date().getTime();
    var filename = now + "_id" + outputFilename + ".mp3"
    var path = "./../Client/public/voice/" + filename
    await writeFile(path, response.audioContent, 'binary');
    console.log('Audio content written to file: ' + filename);
    return filename;
}

//upload
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        // fs.mkdir(folder, err => cb(err, folder));
        cb(null, folder);
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + file.originalname);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

//API
router.get('/', function(req, res) {
    //res.send('PDF get API ok!');
    res.send(getFiles(folder));
});

/**
 * @description: upload file to server
 *
 */
router.post('/upload', function(req, res) {
    //TODO: Return url of pdf
    upload(req, res, function(err) {
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

router.get('/ocr', function(req, res) {
    try {
        var lang = req.query.lang;
        var filename = req.query.url;
        console.log("ocr file " + filename + " in language " + lang);
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
                    .progress()
                    .then(({
                        text
                    }) => {
                        // console.log(text);
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

router.get('/pdf2text', function(req, res) {
    try {
        var lang = req.query.lang;
        var filename = req.query.url;
        console.log("pdf2text " + filename + " in language " + lang);
        let dataBuffer = fs.readFileSync(filename);
        pdf(dataBuffer).then(function(data) {
            // console.log({ data: data });
            res.send(data.text);
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            msg: err.message
        });
    }
})

router.get('/voice', function(req, res) {
    try {
        var text = req.query.text;
        var lang = req.query.lang;
        var outputFilename = req.query.filename;
        console.log("get voice  in language " + lang);
        getVoice(text, lang, outputFilename).then(function(link2voice) {
            res.send(link2voice);
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            msg: err.message
        });
    }
})



module.exports = router;