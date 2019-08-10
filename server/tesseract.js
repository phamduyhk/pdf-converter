const Tesseract = require('tesseract.js');
const {
    TesseractWorker,
    utils: {
        loadLang
    }
} = Tesseract;
const worker = new TesseractWorker();

var recognize = function(filename, lang){
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
                    worker.terminate();
                });
        });
}
var filename = "./public/pdf/1565422041470.png";
var filename = "./public/pdf/1565422923971S__115441671.jpg";
var lang = "jpn";
recognize(filename,lang);

module.exports = recognize;