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
        this.activeNode = args.activeNode || ko.observable(null);

        this.addNodeCallback = args.addNodeCallback;
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Vráti ikonku pre uzol v dokumente.
     * 
     * @param {object} node Uzol v dokumente.
     */
    Model.prototype._icon = function(node) {
        return !node.nodes().length ? "markdown" :
               !node.isExpanded() ? "folder" :
               "folder_open";
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Spustí editáciu šablóny.
     */
    Model.prototype.editTemplate = function () {
        this.select(null);
        this.editor("template");
        this.title("Šablóna");
    };
    

    /**
     * Zbalí/rozbalí uzol v dokumente.
     * 
     * @param {object} node Uzol v dokumente.
     */    
    Model.prototype.expand = function (node) {
        node.isExpanded(!node.isExpanded());
    };


    /**
     * Vyberie uzol v dokumente.
     * 
     * @param {object} node Uzol v dokumente.
     */    
    Model.prototype.select = function (node) {
        var n = this.activeNode();
        if (n) {
            n.isActive(false);
        }

        if (node) {
            node.isActive(true);
        }
        
        this.title(node ? node.title() : "");
        this.activeNode(node);
        // TODO : NASTAVIT SPRAVNY EDITOR MOD
        this.editor("");
    };    


    /**
     * Vytvorí nový uzol v dokumente.
     * 
     * @param {object} parent Nadradený uzol v dokumente.
     */    
    Model.prototype.add = function (parent) {
        if (typeof (this.addNodeCallback) !== "function") {
            return;
        }
        
        var $this = this;

        this.addNodeCallback(parent).then(function(node) {
            if(!node) {
                return;
            }
            
            if(node.parent) {
                node.parent.isExpanded(true);
            }
            
            $this.select(node);
        });
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