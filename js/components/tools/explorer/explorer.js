define([
    "knockout",
    "text!./explorer.html",
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
        console.log("ExplorerTool()");

        this.editor = args.editor || ko.observable("");
        this.title = args.title || ko.observable("");
        this.hasTemplate = args.hasTemplate || ko.observable(false);
        this.nodes = args.nodes || ko.observableArray([]);
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Spustí editáciu šablóny.
     */
    Model.prototype.editTemplate = function () {
        this.editor("template");
        this.title("Šablóna");
    };
    

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~ExplorerTool()");
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