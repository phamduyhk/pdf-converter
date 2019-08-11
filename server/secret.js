// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
async function getVoice(text, language, output) {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();
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
    var filename = "./public/voice/" + output + ".mp3"
    await writeFile(filename, response.audioContent, 'binary');
    console.log('Audio content written to file: ' + filename);
    return filename;
}

getVoice("this i a test", "en-US", "test").then(function(res) {
    console.log("hoge");
    console.log(res);
})