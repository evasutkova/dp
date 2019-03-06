(function (root, factory) {
    if ((typeof (define) === "function") && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    }
    else {
        // Browser globals
        factory();
    }
}(typeof (self) !== "undefined" ? self : this, function () {
    //#region [ Fields ]

    var global = (function () { return this; })();

    //#endregion    


    //#region [ Utils ]

    if (!global.Array.prototype.move) {
        /**
         * Moves element in the array from one old_index to new_index.
         *
         * @param {number} old_index Old index.
         * @param {number} new_index New index.
         */
        global.Array.prototype.move = function (old_index, new_index) {
            while (old_index < 0) {
                old_index += this.length;
            }
            while (new_index < 0) {
                new_index += this.length;
            }
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this;
        };
    }

    //#endregion    
}));