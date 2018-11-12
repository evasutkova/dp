define([
    "knockout",
    "text!./loader.html"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("Loader()");

        this.title = ko.isObservable(args.title) ? args.title : ko.observable(args.title || "");
        this.cancelText = ko.isObservable(args.cancelText) ? args.cancelText : ko.observable(args.cancelText || "");

        this.closeCallback = args.closeCallback;
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Zavrie loader.
     */
    Model.prototype.close = function () {
        if(typeof(this.closeCallback) === "function") {
            this.closeCallback(false);
        }
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~Loader()");
    };

    //#endregion


    //#region [ Methods : Static ]

    /**
	 * Factory method.
	 *
	 * @param {object} params Parameters.
     * @param {object} componentInfo Component into.
     * @returns {object} Instance of the model.
	 */
    Model.createViewModel = function (params, componentInfo) {
        return new Model(params, componentInfo);
    };

    //#endregion

    return {
        viewModel: { createViewModel: Model.createViewModel },
        template: view
    };
});