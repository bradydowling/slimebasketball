module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            js: {
                files: ['*.js'],
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true,
                },
            },
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};