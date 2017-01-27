'use strict';
const fs = require('fs');
const path = require('path');
const logger = require('./logger.js')('app');

const CACHE_DIR = path.join(__dirname, '../data/cache');
require('mkdirp').sync(CACHE_DIR);

const http = require('http');
const https = require('https');

let cacheInfo = [];

const CACHE_INFO_PATH = path.join(__dirname, '../data/cache_info.json');

try{
    cacheInfo = require(CACHE_INFO_PATH);
}catch(err) {
    logger.error('require cacheInfo error.', err);
}

logger.debug(JSON.stringify(cacheInfo));

exports.downloadAll = function downloadAllN(infos) {
    let promises = [];
    infos.forEach(function(value) {
        promises.push(exports.download(value.name, value.url));
    });
    return Promise.all(promises);
};

exports.download = function downloadN(name, url) {
    return new Promise((resolve,reject) => {
        if(!name || !url ) {
            let err = new Error('invalid param');
            reject(err);
            return;
        }

        let findResult = exports.find(name);
        if(findResult){
            resolve(findResult);
            return;
        }
        
        logger.info('download url:', url, 'NAME:', name);
        let hhh = url.substr(0,5) === 'https' ? https : http ;

        hhh.get(url, function(res) {
            let pathname = path.join(CACHE_DIR, name);
            let rr = fs.createWriteStream(pathname);
            res.pipe(rr);
            rr.on('finish', function() {
                let info = { name: name, url: url, pathname: pathname };
                logger.info('Sync cache success:', info);
                cacheInfo.push(info);
                let fd = fs.openSync(CACHE_INFO_PATH, 'w');
                fs.writeSync(fd, JSON.stringify(cacheInfo));
                fs.closeSync(fd);
                resolve(info);
            });
        });
    });
};

 
exports.find = function findN(name) {
    let index = 0;
    // forEach 循环里不方便直接return
    for(index = 0; index < cacheInfo.length; ++index) {
        if(cacheInfo[index].name.trim() === name.trim()) {
//            logger.info('finded');
            return cacheInfo[index];
        }
    }
    return false;
};