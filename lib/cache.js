var Promise = require('promise');
var fs = require('fs');
var path = require('path');
var logger = require('./logger.js')('app');

var CACHE_DIR = path.join(_dirname, '../data/cache');
require('mkdirp').sync(CACHE_DIR);

var http = require('http');

var cacheInfo = [];

var CACHE_INFO_PATH = path.join(__dirname, '../data/cache_info.json');

try{
    cacheInfo = require(CACHE_INFO_PATH);
}catch(e) {}

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
        
        http.get(url, function(res) {
            var pathname = path.join(CACHE_DIR, name);
            var rr = fs.createReadStream(pathname);
            res.pipe(rr);
            rr.on('finish', function() {
                var info = { name: name, url: url, pathname: pathname };
                logger.info('Sync cache success:', info);
                cacheinfo.push(info);
                var fd = fs.openSync(CACHE_INFO_PATH, 'w');
                fs.writeSync(fd, JSON.stringify(cacheInfo));
                fs.closeSync(fd);
                resolve(info);
            });
        });
    });
};

 
exports.find = function(name) {
    cacheInfo.forEach(function(value){
        if(value.name === name) {
            return value;
        }
    });
    return false;
};