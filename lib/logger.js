var winston = require('winston');
var moment = require('moment');

var config = require('./config');
var logDir = config.log_dir;

if (!logDir) {
    logDir = require('path').dirname(__dirname) + '/logs';
}

require('mkdirp').sync(logDir);

var loggers = {};

var logLevel = config.log_level || 'debug';

process.on('SIGUSR2', function() {
    console.log('Got SIGUSR2');
    console.log('Current log level is: ' + logLevel);
    console.log('Config log level is: ' + config.log_level);

    if(logLevel !== 'debug') {
        console.log('Set log_level to: debug');
        logLevel = 'debug';
        for( var child in loggers ) {
            loggers[child].transports.console.level = logLevel;
            loggers[child].transports.file.level = logLevel;
        }
    }else {
        console.log('Set log_level to config_log_level: ' + config.log_level);
        logLevel = config.log_level;
        for( var child2 in loggers ) {
            loggers[child2].transports.console.level = logLevel;
            loggers[child2].transports.file.level = logLevel;
        }
    }
});

module.exports = function(type) {
        
    if (!loggers[type]) {

        var logFile = logDir + '/' + type + '.log';

        var logger = new (winston.Logger)({
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
