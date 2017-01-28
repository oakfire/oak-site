// 语言规范: https://github.com/felixge/node-style-guide 
// 先不管缩进
'use strict';
const express = require('express');
const app = express();
const logger = require('./logger.js')('app');
const path = require('path');

// access log
const morgan = require('morgan');
const config = require('./config');
const logDir = require('./logger.js').logDir;
const fs = require('fs');
let logStream = fs.createWriteStream(logDir + '/access.log', {flags: 'a'});
app.use(morgan('combined', {stream: logStream}));

// view engine setup
// jade 因名称版权问题改名为了"pug"
const pug = require('pug');
app.engine('jade', pug.__express);
app.engine('pug', pug.__express);
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

// static res
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 86400000 })); // one week cache

// for parsing application/json
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data ,  files uploading.
// 这个还是在有上传文件需求的 router 里再用
// var multer = require('multer');
// app.use(multer);

// main router
const indexRouter = require('../routers/index.js');
app.use(indexRouter);

const insRouter = require('../routers/instagram.js');
app.use(['/ins','/photo'], insRouter);

const toolsRouter = require('../routers/tools.js');
app.use('/tools', toolsRouter);

// catch 404
app.use(function on404N(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
}); 

// error handlers
app.use(function onErrorN(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: ( app.get('env') === 'development'? err : {} ) 
    });
});



app.locals.title = 'oakfire';
app.locals.email = 'oakfire@163.com';

module.exports = app;
