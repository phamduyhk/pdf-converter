var PDFJS = null;

function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    //ret.text = ret.text ? ret.text : "";

    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
        .then(function(textContent) {
            let lastY, text = '';
            //https://github.com/mozilla/pdf.js/issues/8963
            //https://github.com/mozilla/pdf.js/issues/2140
            //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
            //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
            for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY){
                    text += item.str;
                }  
                else{
                    text += '\n' + item.str;
                }    
                lastY = item.transform[5];
            }            
            //let strings = textContent.items.map(item => item.str);
            //let text = strings.join("\n");
            //text = text.replace(/[ ]+/ig," ");
            //ret.text = `${ret.text} ${text} \n\n`;
            return text;
        });
}

const DEFAULT_OPTIONS = {
    pagerender: render_page,
    max: 0,
    //check https://mozilla.github.io/pdf.js/getting_started/
    version: 'v1.10.100'
}

async function PDF(dataBuffer, options) {
    var isDebugMode = false;

    let ret = {
        numpages: 0,
        numrender: 0,
        info: null,
        metadata: null,
        text: "",
        version: null
    };

    if (typeof options == 'undefined') options = DEFAULT_OPTIONS;
    if (typeof options.pagerender != 'function') options.pagerender = DEFAULT_OPTIONS.pagerender;
    if (typeof options.max != 'number') options.max = DEFAULT_OPTIONS.max;
    if (typeof options.version != 'string') options.version = DEFAULT_OPTIONS.version;
    if (options.version == 'default') options.version = DEFAULT_OPTIONS.version;
    if (typeof options.startpage == 'undefined') options.startpage = 1;
    if (typeof options.startpage != 'number') options.startpage = 1;

    PDFJS = PDFJS ? PDFJS : require(`./pdf.js/${options.version}/build/pdf.js`);

    ret.version = PDFJS.version;

    // Disable workers to avoid yet another cross-origin issue (workers need
    // the URL of the script to be loaded, and dynamically loading a cross-origin
    // script does not work).
    PDFJS.disableWorker = true;
    let doc = await PDFJS.getDocument(dataBuffer);
    ret.numpages = doc.numPages;

    let metaData = await doc.getMetadata().catch(function(err) {
        return null;
    });

    ret.info = metaData ? metaData.info : null;
    ret.metadata = metaData ? metaData.metadata : null;

    // set start page
    let startpage = options.startpage
    startpage = options.startpage <= doc.numPages ? startpage : doc.numPages;
    startpage = startpage > 0 ? startpage : 1;

    let counter = options.max <= 0 ? doc.numPages : options.max;
    counter = counter > doc.numPages ? doc.numPages : counter;
    counter = (startpage + counter) > doc.numPages ? doc.numPages - startpage : counter;

    ret.text = "";

    console.log({PDFStartPage:startpage});
    console.log({numpages:counter});
    for (var i = startpage; i <= startpage+counter; i++) {
        let pageText = await doc.getPage(i).then(pageData => options.pagerender(pageData)).catch((err)=>{
            // todo log err using debug
            debugger;
            return "";
        });

        ret.text = `${ret.text}\n\n${pageText}`;
    }

    ret.numrender = counter;
    doc.destroy();

    return ret;
}

module.exports = PDF;
