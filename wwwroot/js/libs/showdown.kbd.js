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
        type: "lang",
        regex: /\s~(\w+)+~\s/g,
        replace: "<kbd>$1</kbd>"
    };

    // Loading extension into shodown
    showdown.extension("kbd", function () {
        return [Extension];
    });

    //#endregion

    return Extension;   
}));