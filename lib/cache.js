var Promise = require('promise');
var fs = require('fs');
var path = require('path');

var DATA_DIR = path.join(_dirname, '../data');
require('mkdirp').sync(DATA_DIR);

var cacheInfo = [];

exports.download = function(url) {
    return new Promise(function(resolve,reject){
        
    }
};

 
exports.find = function(name) {
};