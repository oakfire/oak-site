'use strict';
const winston = require('winston');
const moment = require('moment');

const config = require('./config');
let logDir = config.log_dir;

if (!logDir) {
    logDir = require('path').dirname(__dirname) + '/logs';
}

require('mkdirp').sync(logDir);

let loggers = {};

let logLevel = config.log_level || 'debug';

process.on('SIGUSR2', () => {

    if(logLevel !== 'debug') {
        logLevel = 'debug';
        for( let child in loggers ) {
            loggers[child].warn('Got SIGUSR2');
            loggers[child].warn('Set log level to: ' + logLevel);
            loggers[child].warn('Config log level is: ' + config.log_level);
            loggers[child].transports.console.level = logLevel;
            loggers[child].transports.file.level = logLevel;
        }
    }else {
        logLevel = config.log_level;
        for( let child in loggers ) {
            loggers[child].warn('Got SIGUSR2');
            loggers[child].warn('Set log level to: ' + logLevel);
            loggers[child].warn('Config log level is: ' + config.log_level);
            loggers[child].transports.console.level = logLevel;
            loggers[child].transports.file.level = logLevel;
        }
    }
});

module.exports = function getLoggerN(type) {
        
    if (!loggers[type]) {

        let logFile = logDir + '/' + type + '.log';

        let logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    level: logLevel || 'debug',
                    colorize: true,
                    timestamp: function() { return moment().format(); },
                    /** 生产环境需要 silent: true */
                    silent: config.console_quiet
                }),
                new (winston.transports.File)({
                    json: false,
                    level: logLevel || 'debug',
                    timestamp: function() { return moment().format(); },
                    filename: logFile
                })
            ]
        });

        loggers[type] = logger;
    }

    return loggers[type];

};

module.exports.logDir = logDir;
