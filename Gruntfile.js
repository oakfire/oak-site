module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'lib/**/*.js',
                'routers/**/*.js',
                'bin/*',
            ],
            options: {
                node: true,
                esversion: 6,
            }
        },
        puglint: {
            src:['views/**/*.pug'],
        },
        less: {
            compile: {
                files: {
                    'public/css/layout.css': 'views/less/layout.less'
                }
            }
        }
    });

    // load jshint plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // load pug lint plugin
    grunt.loadNpmTasks('grunt-puglint');

    // load less plugin
    grunt.loadNpmTasks('grunt-contrib-less');

    // register default task
    grunt.registerTask('default', ['jshint','puglint','less']);
}