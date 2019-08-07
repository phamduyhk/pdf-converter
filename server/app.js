const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
/**
 * Constant Value
 */
const PORT = require('./config').productionPort || 8080;
const router = require('./api');

app.disable('x-powered-by'); // for security

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', express.static('../Client'));

// app.use('/api', router);
server.listen(PORT);
console.log('The magic happens on port ' + PORT);