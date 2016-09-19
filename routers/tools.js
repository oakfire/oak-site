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
    {
        name: 'UNIX 时间戳转换',
        path: 'unixtime',
    },
];

function checkTool(path) {
    for(var i = 0; i < toolsInfo.length; ++i){
        if(toolsInfo[i].path == path) {
           return true;
        }
    }
    return false; 
}

router.get('/', function onToolsIndex(req, res) {
    var renderData = { toolsInfo: toolsInfo };
    res.render('tools', renderData);  
});

router.get('/:toolname', function onToolContent(req, res, next){
    var toolname = req.params.toolname;
    if(!checkTool(toolname)){
        return next();
    }
    var renderData = { 
        toolsInfo: toolsInfo,
        toolname: toolname,
    };
    res.render('tools/' + toolname, renderData);
});

module.exports = router;

