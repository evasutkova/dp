(function (root, factory) {
    if ((typeof (define) === "function") && define.amd) {
        // AMD. Register as an anonymous module.
        define(["showdown"], factory);
    } 
    else {
        // Browser globals
        return factory(root.showdown);
    }
}((typeof (self) !== "undefined") ? self : this, function (showdown) {
    //#region [ Extension ]

    var Extension = {
        type: "output",
        filter: function(text, converter, options) {
            var left  = "<pre><code class=\"jsfiddle language-jsfiddle\">";
            var right = "</code></pre>";
            var flags = "g";
            var replacement = function(wholeMatch, match, left, right) {
                var source = (match || "").trim().split("\n");
                if(!source.length) {
                    return "";
                }

                var id = source[0];
                var params = source[1] || "js,html,css,result";
                var theme = source[2] || "dark";
                var size = (source[3] || "").split(",");
                
                if(size.length !== 2) {
                    return '<script async src="https://jsfiddle.net/' + id + '/embed/' + params + '/' + theme + '/"></script>';
                }

                var w = size[0];
                var h = size[1];

                return '<iframe width="' + w + '" height="' + h + '" src="https://jsfiddle.net/' + id + '/embedded/' + params + '/' + theme + '/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>';
            };

            return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
        }
    };

    // Loading extension into shodown
    showdown.extension("jsfiddle", function () {
        return [Extension];
    });

    //#endregion

    return Extension;    
}));