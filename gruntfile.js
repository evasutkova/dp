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
            blank: {
                files: [{
                    expand: true,
                    src: ["blank.xhtml"],
                    rename: function () {
                        return "wwwroot/blank.html";
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
            fonts: {
                files: [{
                    expand: true,
                    cwd: "fonts/",
                    src: ["**"],
                    dest: "wwwroot/fonts/",
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
                    "wwwroot/css/user.css": "js/components/user/user.less",
                    "wwwroot/css/tools.css": "js/components/tools/tools.less",
                    "wwwroot/css/drive-tool.css": "js/components/tools/drive/drive.less",
                    "wwwroot/css/explorer-tool.css": "js/components/tools/explorer/explorer.less",
                    "wwwroot/css/settings-tool.css": "js/components/tools/settings/settings.less",
                    "wwwroot/css/images-tool.css": "js/components/tools/images/images.less",
                    "wwwroot/css/cheatsheet-tool.css": "js/components/tools/cheatsheet/cheatsheet.less",
                    "wwwroot/css/emoji-tool.css": "js/components/tools/emoji/emoji.less",
                    "wwwroot/css/modals.css": "js/components/modals/modals.less",
                    "wwwroot/css/prompt-modal.css": "js/components/modals/prompt/prompt.less",
                    "wwwroot/css/confirm-modal.css": "js/components/modals/confirm/confirm.less",
                    "wwwroot/css/file-browser-modal.css": "js/components/modals/file-browser/file-browser.less",
                    "wwwroot/css/window-modal.css": "js/components/modals/window/window.less",
                    "wwwroot/css/editors.css": "js/components/editors/editors.less",
                    "wwwroot/css/template-editor.css": "js/components/editors/template/template.less",
                    "wwwroot/css/markdown-editor.css": "js/components/editors/markdown/markdown.less",
                    "wwwroot/css/image-editor.css": "js/components/editors/image/image.less",
                    "wwwroot/css/script-editor.css": "js/components/editors/script/script.less",
                    "wwwroot/css/loader.css": "js/components/loader/loader.less",
                    "wwwroot/css/keywords.css": "js/components/keywords/keywords.less",
                    "wwwroot/css/node-id.css": "js/components/node-id/node-id.less",
                    "wwwroot/css/new-node-action.css": "js/components/actions/new-node/new-node.less",
                    "wwwroot/css/new-image-action.css": "js/components/actions/new-image/new-image.less",
                    "wwwroot/css/new-script-action.css": "js/components/actions/new-script/new-script.less",
                    "wwwroot/css/new-project.css": "js/components/new-project/new-project.less"
                }
            }
        },
        concat: {
            css: {
                src: [
                    "wwwroot/css/materialize.css",
                    "wwwroot/css/optiscroll.css",
                    "wwwroot/css/codemirror.css",
                    "wwwroot/css/codemirror.simplescrollbars.css",
                    "wwwroot/css/highlight.css",
                    "wwwroot/css/katex.css",
                    "wwwroot/css/dp-icons.css",
                    "wwwroot/css/site.css",
                    "wwwroot/css/app.css",
                    "wwwroot/css/toolbar.css",
                    "wwwroot/css/user.css",
                    "wwwroot/css/tools.css",
                    "wwwroot/css/drive-tool.css",
                    "wwwroot/css/explorer-tool.css",
                    "wwwroot/css/settings-tool.css",
                    "wwwroot/css/images-tool.css",
                    "wwwroot/css/cheatsheet-tool.css",
                    "wwwroot/css/emoji-tool.css",
                    "wwwroot/css/modals.css",
                    "wwwroot/css/prompt-modal.css",
                    "wwwroot/css/confirm-modal.css",
                    "wwwroot/css/file-browser-modal.css",
                    "wwwroot/css/window-modal.css",
                    "wwwroot/css/editors.css",
                    "wwwroot/css/template-editor.css",
                    "wwwroot/css/markdown-editor.css",
                    "wwwroot/css/image-editor.css",
                    "wwwroot/css/script-editor.css",
                    "wwwroot/css/loader.css",
                    "wwwroot/css/keywords.css",
                    "wwwroot/css/node-id.css",
                    "wwwroot/css/new-node-action.css",
                    "wwwroot/css/new-image-action.css",
                    "wwwroot/css/new-script-action.css",
                    "wwwroot/css/new-project.css"
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
            "copy:blank",
            "copy:css",
            "copy:fonts",
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