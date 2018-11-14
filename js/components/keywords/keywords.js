define([
    "knockout",
    "text!./keywords.html"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("Keywords()");

        this.keywords = args.keywords || ko.observable("");
        this.items = ko.computed(this._items, this);
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Zoznam kľúčových slov.
     */
    Model.prototype._items = function () {
        var keywords = this.keywords();

        if(!keywords.length) {
            return [];
        }

        return keywords.split(",");
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~Keywords()");

        this.items.dispose();
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