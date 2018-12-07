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
            var left  = "<pre><code class=\"iframe language-iframe\">";
            var right = "</code></pre>";
            var flags = "g";
            var replacement = function(wholeMatch, match, left, right) {
                var source = (match || "").trim().split("\n");
                if(!source.length) {
                    return "";
                }

                var url = source[0];
                var size = (source[1] || "").split(",");
                
                if(size.length !== 2) {
                    size = ["100%", "400"];
                }

                var w = size[0];
                var h = size[1];

                return '<iframe width="' + w + '" height="' + h + '" src="' + url + '" allowfullscreen="allowfullscreen" frameborder="0" allowtransparency="true" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups"></iframe>';
            };

            return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
        }
    };

    // Loading extension into shodown
    showdown.extension("iframe", function () {
        return [Extension];
    });

    //#endregion

    return Extension;    
}));