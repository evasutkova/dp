(function (root, factory) {
    if ((typeof (define) === "function") && define.amd) {
        // AMD. Register as an anonymous module.
        define(["showdown", "katex"], factory);
    } 
    else {
        // Browser globals
        return factory(root.showdown, root.katex);
    }
}((typeof (self) !== "undefined") ? self : this, function (showdown, katex) {
    //#region [ Extension ]

    var Extension = {
        type: "lang",
        // Showdown does the following escape/normalization: Replaces $ (dollar sign) with ¨D
        regex: /¨D(.+)¨D/g,
        replace: function() {
            var args = Array.prototype.slice.call(arguments);
            var key = args[1];
            if(!key) {
                 return "";
            }

            var html = katex.renderToString(key, {
                throwOnError: false
            });
            return html;
        }
    };

    var Extension2 = {
        type: "lang",
        // Showdown does the following escape/normalization: Replaces $ (dollar sign) with ¨D
        regex: /^¨D¨D\n(.+)\n¨D¨D$/gm,
        replace: function() {
            var args = Array.prototype.slice.call(arguments);
            var key = args[1];
            if(!key) {
                 return "";
            }

            var html = katex.renderToString(key, {
                throwOnError: false,
                displayMode: true
            });
            return html;
        }
    };    
    
    // Loading extension into shodown
    showdown.extension("katex", function () {
        return [Extension, Extension2];
    });

    //#endregion

    return Extension;   
}));