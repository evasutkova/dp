(function (root, factory) {
    if ((typeof (define) === "function") && define.amd) {
        // AMD. Register as an anonymous module.
        define(["showdown", "emoji"], factory);
    } 
    else {
        // Browser globals
        return factory(root.showdown, root.emoji);
    }
}((typeof (self) !== "undefined") ? self : this, function (showdown, emoji) {
    //#region [ Extension ]

    var Extension = {
        type: "lang",
        regex: /:([\w-]+)(\|([\w-\s]+))?:/g,
        replace: function() {
            var args = Array.prototype.slice.call(arguments);
            var match = args[0];
            var key = args[1];
            if(!key) {
                return "";
            }

            var modifiers = (args[3] || "");
            if(modifiers) {
                modifiers = modifiers.split(" ").map(function(cn) {
                    return "emoji--" + cn;
                });
            }

            var classNames = ["emoji"];
            if ((modifiers || []).length) {
                classNames = classNames.concat(modifiers);
            }
            classNames = classNames.join(" ");

            var icon = emoji.find(function(e) {
                return e.n === key;
            });
            
            if(!icon) {
                return match;
            }

            return '<svg width="24px" height="24px" viewBox="0 0 24 24" class="' + classNames + '"><path d="' + icon.d + '"></path></svg>'
        }
    };
    
    // Loading extension into shodown
    showdown.extension("materialicons", function () {
        return [Extension];
    });

    //#endregion

    return Extension;   
}));