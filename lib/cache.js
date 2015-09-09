var Promise = require('promise');
var fs = require('fs');
var path = require('path');
var logger = require('./logger.js')('app');

var CACHE_DIR = path.join(__dirname, '../data/cache');
require('mkdirp').sync(CACHE_DIR);

var http = require('http');
var https = require('https');

var cacheInfo = [];

var CACHE_INFO_PATH = path.join(__dirname, '../data/cache_info.json');

try{
    cacheInfo = require(CACHE_INFO_PATH);
}catch(e) {}

logger.debug(JSON.stringify(cacheInfo));

exports.downloadAll = function(infos) {
    var len = infos.length;
    var promises = [];
    infos.forEach(function(value) {
        promises.push(exports.download(value.name, value.url));
    });
    return Promise.all(promises);
};

exports.download = function(name, url) {
    return new Promise(function(resolve,reject){
        if(!name || !url ) {
            var err = new Error('invalid param');
            reject(err);
            return;
        }

        var findResult = exports.find(name);
        if(findResult){
            resolve(findResult);
            return;
        }
        
        logger.info('download url:', url, 'NAME:', name);
        var hhh;
        if(url.substr(0,5) === 'https'){
            hhh = https;
        }else {
            hhh = http;
        }
        hhh.get(url, function(res) {
            var pathname = path.join(CACHE_DIR, name);
            var rr = fs.createWriteStream(pathname);
            res.pipe(rr);
            rr.on('finish', function() {
                var info = { name: name, url: url, pathname: pathname };
                logger.info('Sync cache success:', info);
                cacheInfo.push(info);
                var fd = fs.openSync(CACHE_INFO_PATH, 'w');
                fs.writeSync(fd, JSON.stringify(cacheInfo));
                fs.closeSync(fd);
                resolve(info);
            });
        });
    });
};

 
exports.find = function(name) {
    var index = 0;
    // forEach 循环里不能return? 是异步?
    for(index = 0; index < cacheInfo.length; ++index) {
        if(cacheInfo[index].name.trim() === name.trim()) {
//            logger.info('finded');
            return cacheInfo[index];
        }
    }
    return false;
};