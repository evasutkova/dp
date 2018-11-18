define([
    "knockout",
    "text!./image.html",
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
        console.log("ImageEditor()");

        this.items = args.items || ko.observableArray([]);

        this.selectImageCallback = args.selectImageCallback;
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vyberie obrázok.
     * 
     * @param {object} image Obrázok.
     */    
    Model.prototype.select = function (node) {
        if (typeof (this.selectImageCallback) !== "function") {
            return;
        }

        this.selectImageCallback(node);
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~ImageEditor()");
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