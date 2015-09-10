// 语言规范: https://github.com/felixge/node-style-guide 
// 先不管缩进

var express = require('express');
var app = express();
var logger = require('./logger.js')('app');
var path = require('path');

// access log
var morgan = require('morgan');
var config = require('./config');
var logDir = require('./logger.js').logDir;
var fs = require('fs');
var logStream = fs.createWriteStream(logDir + '/access.log', {flags: 'a'});
app.use(morgan('combined', {stream: logStream}));

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

// static res
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 86400000 })); // one week cache

// for parsing application/json
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data ,  files uploading.
// 这个还是在有上传文件需求的 router 里再用
// var multer = require('multer');
// app.use(multer);

// main router
var indexRouter = require('../routers/index.js');
app.use(indexRouter);

var insRouter = require('../routers/instagram.js');
app.use(['/ins','/photo'], insRouter);

// catch 404
app.use(function on404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}); 

// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: ( app.get('env') === 'development'? err : {} ) 
    });
});



app.locals.title = 'oakfire';
app.locals.email = 'oakfire@163.com';

module.exports = app;
