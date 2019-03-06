define([
    "knockout",
    "text!./node-id.html",
    "dp/polyfills/string"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("NodeId()");

        this.node = args.node || ko.observable(null);
        this.id = ko.computed(this._id, this);
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Zistí identifikátor uzla.
     */
    Model.prototype._id = function () {
        var node = this.node();

        if(!node) {
            return "-";
        }

        var id = node.title().toCodeName();

        var p = node;
        while(p.parent) {
            p = p.parent;
            id = p.title().toCodeName() + "_" + id;
        }
        
        return id;
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~NodeId()");

        this.id.dispose();
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