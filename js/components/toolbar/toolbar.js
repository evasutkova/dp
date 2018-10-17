define([
    "knockout",
    "text!./toolbar.html"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("Toolbar()");

        this.tool = args.tool || ko.observable("");
        this.isConnected = args.isConnected || ko.observable(false);
    };

    //#endregion


    //#region [ Methods : Public ]
    
    /**
     * Nastaví aktívny tool.
     * 
     * @params {string} tool Nástroj, ktorý sa má aktivovať.
     */
    Model.prototype.setTool = function (tool) {
        if(this.tool() === tool) {
            this.tool("");
            return;
        }
        this.tool(tool);
    };


    /**
     * Odhlásenie používateľa.
     */
    Model.prototype.disconnect = function () {
        console.info(this);
    };
    

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~Toolbar()");
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