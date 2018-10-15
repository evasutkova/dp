module.exports = function (grunt) {
    //#region [ Config ]

    grunt.initConfig({
        package: grunt.file.readJSON("package.json"),
        clean: {
            wwwroot: [
                "wwwroot/**/*"
            ]
        },
        copy: {
            index: {
                options: {
                    process: function (content, srcpath) {
                        return content
                            .replace(/\{version\}/g, grunt.config("package").version)
                            .replace(/\{homepage\}/g, grunt.config("package").homepage)
                            .replace(/\{cacheBust\}/g, new Date().getTime());
                    }
                },
                files: [{
                    expand: true,
                    src: ["index.xhtml"],
                    rename: function () {
                        return "wwwroot/index.html";
                    }
                }]            
            }
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("cleanTask", cleanTask);
    grunt.registerTask("buildTask", buildTask);

    //#endregion


    //#region [ Methods ]

    /**
     * Clean task.
     */
    function cleanTask() {
        grunt.task.run.apply(grunt.task, [
            "clean:wwwroot"
        ]);
    }


    /**
     * Build task.
     */
    function buildTask(target) {
        grunt.log.writeln("Build verzie \"" + grunt.config("package").version + "\"");
        grunt.task.run.apply(grunt.task, [
            "copy:index"
        ]);
    }     

    //#endregion
};