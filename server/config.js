const secret = require('./secret');

module.exports = {
    localURI: secret.test_localURI, // use secret.test_localURI for test
    localDb: secret.test_localDB, // use secret.test_localDB for test
    remoteURL: secret.test_remoteURL, // use secret.test_remoteURL for test
    remoteDB: secret.test_remoteDb, // use secret.test_remoteDb for test
    productionPort: 80,

};
