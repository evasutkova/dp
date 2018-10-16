module.exports = function (grunt) {
    //#region [ Config ]

    grunt.initConfig({
        package: grunt.file.readJSON("package.json"),
        clean: {
            wwwroot: [
                "wwwroot/**/*"
            ],
            css: [
                "wwwroot/css/*",
                "!wwwroot/css/site.css"
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
            },
            app: {
                options: {
                    process: function (content, srcpath) {
                        return content
                            .replace(/\{version\}/g, grunt.config("package").version)
                            .replace(/\{homepage\}/g, "https://evasutkova.github.io/dp/");
                    }
                },
                files: [{
                    expand: true,
                    src: ["app.xhtml"],
                    rename: function () {
                        return "wwwroot/app.html";
                    }
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: "css/",
                    src: ["**"],
                    dest: "wwwroot/css/",
                    filter: "isFile"
                }]
            },
            materialize: {
                options: {
                    process: function (content, srcpath) {
                        return "(function (root, factory) {\n\
                                    if (typeof (define) === 'function' && define.amd) {\n\
                                        define(['jquery'], factory);\n\
                                    }\n\
                                    else {\n\
                                        factory(root.jQuery);\n\
                                    }\n\
                                }(typeof (self) !== 'undefined' ? self : this, function (jQuery) {\n"
                                    + content +
                                    "return M;\n\
                                }));";
                    }
                },
                files: [{
                    expand: true,
                    cwd: "js/",
                    src: ["**/materialize.js"],
                    dest: "wwwroot/js/",
                    filter: "isFile"
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: "js/",
                    src: ["**", "!**/*.less", "!**/materialize.js"],
                    dest: "wwwroot/js/",
                    filter: "isFile"
                }]
            }            
        },
        jshint: {
            options: {
                debug: true,
                multistr: true,
                sub: true,
                laxbreak: true,
                globals: {
                    jQuery: true
                }
            },
            src: [
                "gruntfile.js",
                "js/**/*.js",
                "!js/libs/*.js"
            ]
        },
        less: {
            options: {
                paths: ["less"],
                strictMath: false
            },
            src: {
                files: {
                    "wwwroot/css/site.css": "less/site.less",
                    "wwwroot/css/app.css": "js/components/app/app.less",
                    "wwwroot/css/toolbar.css": "js/components/toolbar/toolbar.less",
                    "wwwroot/css/tools.css": "js/components/tools/tools.less",
                    "wwwroot/css/drive-tool.css": "js/components/tools/drive/drive.less",
                    "wwwroot/css/explorer-tool.css": "js/components/tools/explorer/explorer.less",
                    "wwwroot/css/settings-tool.css": "js/components/tools/settings/settings.less",
                    "wwwroot/css/modals.css": "js/components/modals/modals.less",
                    "wwwroot/css/prompt-modal.css": "js/components/modals/prompt/prompt.less"
                }
            }
        },
        concat: {
            css: {
                src: [
                    "wwwroot/css/materialize.css",
                    "wwwroot/css/dp-icons.css",
                    "wwwroot/css/site.css",
                    "wwwroot/css/app.css",
                    "wwwroot/css/toolbar.css",
                    "wwwroot/css/tools.css",
                    "wwwroot/css/drive-tool.css",
                    "wwwroot/css/explorer-tool.css",
                    "wwwroot/css/settings-tool.css",
                    "wwwroot/css/modals.css",
                    "wwwroot/css/prompt-modal.css"
                ],
                dest: "wwwroot/css/site.css"
            }
        },            
        webfont: {
            icons: {
                src: "svg/*.svg",
                dest: "wwwroot/fonts",
                destCss: "wwwroot/css",
                options: {
                    version: "1.0.0",
                    engine: "fontforge",
                    font: "dp-icons",
                    hashes: true,
                    types: "woff2,woff,ttf,svg",
                    template: "templates/index.css",
                    templateOptions: {
                        baseClass: "dp-icons",
                        classPrefix: "dp-icons_"
                    },
                    relativeFontPath: "../fonts",
                    htmlDemo: false,
                    ligatures: true,
                    fontFamilyName: "Dp Icons"
                }
            }
        }        
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-webfont");

    grunt.registerTask("buildTask", function() {
        grunt.log.writeln("Build verzie \"" + grunt.config("package").version + "\"");
        grunt.task.run.apply(grunt.task, [
            "clean:wwwroot",
            "copy:index",
            "copy:app",
            "copy:css",
            "copy:materialize",
            "copy:js",
            "jshint",
            "less",
            "webfont",
            "concat:css",
            "clean:css"
        ]);
    });

    //#endregion
};