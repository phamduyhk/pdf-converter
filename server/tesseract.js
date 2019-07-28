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
var filename = "./tesseract-data/test.png";
var lang = "vie";
recognize(filename,lang);

module.exports = function(){

}