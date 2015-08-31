module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: ['lib/**/*.js', 'routers/**/*.js']
        },
        less: {
            development: {
                files: {
                    'public/css/layout.css': 'views/less/layout.less'
                } 
            }
        } 
    });

    // load jshint plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // load less plugin
    grunt.loadNpmTasks('grunt-contrib-less');

    // register default task
    grunt.registerTask('default', ['jshint','less']);
}