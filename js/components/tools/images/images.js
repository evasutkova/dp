define([
    "knockout",
    "text!./images.html",
    "session!",
    "dp/bindings/optiscroll"
], function (ko, view, session) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("ImagesTool()");

        this.items = args.items || ko.observableArray([]);
        this.search = ko.observable(session.get("search") || "").extend({ rateLimit: 350 });
    };

    //#endregion

    
    //#region [ Methods : Public ]
   
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~ImagesTool()");

        session.set({
            search: this.search()
        });
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