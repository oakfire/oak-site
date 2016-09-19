var express = require('express');
var router = express.Router();
var config = require('../lib/config.js');
var logger = require('../lib/logger.js')('app');

var toolsInfo = [
    { 
        name: 'BASE64 编解码',
        path: 'base64',
    },
    { 
        name: 'ASCII 编码表',
        path: 'ASCII',
    },
];

router.get('/', function onToolsIndex(req, res) {
    var renderData = { toolsInfo: toolsInfo };
    res.render('tools', renderData);  
});

router.get('/:toolname', function onToolContent(req, res){
    var renderData = { toolsInfo: toolsInfo };
    var toolname = req.params.toolname;
    res.render('tools/' + toolname, renderData);
});

module.exports = router;

