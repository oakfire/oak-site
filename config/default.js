/** if changed conifg, restart process to enable new config */
module.exports = {    
    /** default port */
    port: 3000,
    //host: ,
    /** silent console or not */
    console_quiet: false,
    /** log level, can be "silly" "debug" "verbose" "info" "warn" "error" */
    log_level: 'info',
    /** log path, default: logs */
    //log_dir:  '/var/logs/'
}
