define([
    "knockout",
    "text!./images.html",
    "dp/bindings/optiscroll"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("ImagesTool()");
    };

    //#endregion

    //#region [ Methods : Public ]
   
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~ImagesTool()");
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