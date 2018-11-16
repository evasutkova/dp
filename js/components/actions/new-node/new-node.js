define([
    "knockout",
    "text!./new-node.html"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("NewNodeAction()");

        this.activeNode = args.activeNode || ko.observable(null);

        this.addNodeCallback = args.addNodeCallback;
        this.selectNodeCallback = args.selectNodeCallback;
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vytvorí nový uzol v dokumente.
     */    
    Model.prototype.add = function () {
        if ((typeof (this.addNodeCallback) !== "function") 
            || (typeof (this.selectNodeCallback) !== "function")) {
            return;
        }
        
        var parent = this.activeNode();
        var $this = this;
        
        this.addNodeCallback(parent).then(function(node) {
            if(!node) {
                return;
            }
            
            if(node.parent) {
                node.parent.isExpanded(true);
            }
            
            $this.selectNodeCallback(node);
        });
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~NewNodeAction()");
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