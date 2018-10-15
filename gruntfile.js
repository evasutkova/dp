module.exports = function (grunt) {
    //#region [ Config ]

    grunt.initConfig({
        package: grunt.file.readJSON("package.json"),
        clean: {
            wwwroot: [
                "wwwroot/**/*"
            ]
        }        
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("cleanTask", cleanTask);

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

    //#endregion
};