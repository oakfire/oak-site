'use strict';
const express = require('express');
const router = express.Router();
const config = require('../lib/config.js');
const logger = require('../lib/logger.js')('app');

const toolsInfo = [
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
    for(let i = 0; i < toolsInfo.length; ++i){
        if(toolsInfo[i].path == path) {
           return true;
        }
    }
    return false; 
}

router.get('/', function onToolsIndexN(req, res) {
    let renderData = { toolsInfo: toolsInfo };
    res.render('tools', renderData);  
});

router.get('/:toolname', function onToolContentN(req, res, next){
    let toolname = req.params.toolname;
    if(!checkTool(toolname)){
        return next();
    }
    let renderData = { 
        toolsInfo: toolsInfo,
        toolname: toolname,
    };
    res.render('tools/' + toolname, renderData);
});

module.exports = router;

