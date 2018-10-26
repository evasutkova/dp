define([
    "text!./settings.html"
], function (view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("SettingsTool()");

        this.meta = args.meta || ko.observableArray([]);
    };

    //#endregion


    //#region [ Methods : Public ]
    
    /**
     * Pridá nový atribút.
     */
    Model.prototype.add = function () {
        console.log("add()");
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~SettingsTool()");
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