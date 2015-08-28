var express = require('express');
var app = express();
var logger = require('./logger.js')('app');

// access log
var morgan = require('morgan');
var config = require('./config');
var log_dir = require('./logger.js').log_dir;
var fs = require('fs');
var log_stream = fs.createWriteStream(log_dir + '/access.log', {flags: 'a'});
app.use(morgan('combined', {stream: log_stream}));

app.get('/', function(req, res) {
    res.send('hello world');
});

app.locals.title = 'oakfire';
app.locals.email = 'oakfire@163.com';

module.exports = app;
