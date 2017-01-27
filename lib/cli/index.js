'use strict';
const program = require('commander');
const util = require('util');
const path = require('path');
const table = require('cli-table-zh');
const colors = require('colors');

/**
 * list sth info 
 */
program
.command('list [sth]')
.description('List something info')
.action( sth => {
    let self = this;
    let apps_table = new table( {
            head:['First', 'Second'],
            style: { head:['cyan']}
    });
    apps_table.push(['First line', 'Info']); 
    apps_table.push(['Second line', 'Info']);
    apps_table.push(['我是第三行','我是信息']);
    if(sth){
        apps_table.push([sth, 'Info of '+sth]);
    }
    console.log(apps_table.toString());
});

program
.command('add <file>')
.description('add file')
.action(function(file) {
    file = path.resolve(process.cwd(), file);
    console.log('File path:'.green, file);
    console.log('Succeed to add.'.green);
    console.log(('Failed to add. ' + 'Error info...' ).red);
});

program
.command('*')
.action(function() { program.help(); } );


program
.version('0.0.2')
.option('-a,--all', 'show all')
;

module.exports = program;


