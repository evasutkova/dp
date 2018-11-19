define([
    "knockout",
    "text!./explorer.html",
    "dp/bindings/optiscroll",
    "dp/bindings/dropdown"
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
        this.tools = ko.computed(this._tools, this);
        this.isExpanded = args.isExpanded || ko.observable(true);

        this.deleteNodeCallback = args.deleteNodeCallback;
        this.renameNodeCallback = args.renameNodeCallback;
        this.moveNodeCallback = args.moveNodeCallback;
        this.keywordsNodeCallback = args.keywordsNodeCallback;
        this.flagNodeCallback = args.flagNodeCallback;
        this.selectNodeCallback = args.selectNodeCallback;
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Vráti ikonku pre uzol v dokumente.
     * 
     * @param {object} node Uzol v dokumente.
     */
    Model.prototype._icon = function(node) {
        return !node.nodes().length ? "file_document_outline" :
               !node.isExpanded() ? "folder" :
               "folder_open";
    };


    /**
     * Zoznam dostupných nástrojov pre aktívny uzol.
     */
    Model.prototype._tools = function() {
        var node = this.activeNode();
        if(!node) {
            return [];
        }

        var nodes = node.parent ? node.parent.nodes() : this.nodes();
        var index = nodes.indexOf(node);

        // Premenovanie uzla
        var renameAction = {
            node: node,
            text: "Premenovať",
            icon: "rename_box",
            isEnabled: true,
            action: (function (e) {
                if (typeof (this.renameNodeCallback) !== "function") {
                    return;
                }

                var $this = this;
                this.renameNodeCallback(e.node).then(function(node) {
                    if(!node) {
                        return;
                    }
                    $this.select(node);
                });                
            }).bind(this)
        };

        // Vymazanie uzla
        var deleteAction = {
            node: node,
            text: "Vymazať",
            icon: "delete",
            isEnabled: true,
            action: (function (e) {
                if (typeof (this.deleteNodeCallback) !== "function") {
                    return;
                }

                var $this = this;
                this.deleteNodeCallback(e.node).then(function(node) {
                    if (!node) {
                        return;
                    }
                    var parent = node.parent || null;
                    if(parent) {
                        parent.isExpanded(true);
                    }
                    $this.select(parent);
                });
            }).bind(this)
        };

        // Posun uzla nahor
        var moveUpAction = {
            node: node,
            index: index,
            text: "Posunút nahor",
            icon: "arrow_up_thick",
            isEnabled: index > 0,
            action: (function (e) {
                if (typeof (this.moveNodeCallback) !== "function") {
                    return;
                }

                this.moveNodeCallback(e.node, e.index, e.index - 1);
            }).bind(this)
        };
        
        // Posun uzla nadol
        var moveDownAction = {
            node: node,
            index: index,
            text: "Posunút nadol",
            icon: "arrow_down_thick",
            isEnabled: index < nodes.length - 1,
            action: (function (e) {
                if (typeof (this.moveNodeCallback) !== "function") {
                    return;
                }

                this.moveNodeCallback(e.node, e.index, e.index + 1);
            }).bind(this)
        };

        // Nastavenie keywords
        var keywordsAction = {
            node: node,
            index: index,
            text: "Kľúčové slová",
            icon: "tag_text_outline",
            isEnabled: true,
            action: (function (e) {
                if (typeof (this.keywordsNodeCallback) !== "function") {
                    return;
                }

                this.keywordsNodeCallback(e.node);
            }).bind(this)
        };

        // Nastavenie ci je uzol v toc alebo nie
        var inTocAction = {
            node: node,
            flag: "isInToc",
            text: "Zobraziť v obsahu",
            icon: node.isInToc() ? "checkbox_marked_circle_outline" : "checkbox_blank_circle_outline",
            isEnabled: true,
            action: (function (e) {
                if (typeof (this.flagNodeCallback) !== "function") {
                    return;
                }

                this.flagNodeCallback(e.node, e.flag);
            }).bind(this)
        };        
        
        return [
            renameAction,
            keywordsAction,
            inTocAction,
            moveUpAction,
            moveDownAction,
            deleteAction
        ];
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
     * Spustí editáciu obrázkov.
     */
    Model.prototype.editImages = function () {
        this.select(null);
        this.editor("image");
        this.title("Obrázky");
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
        if (typeof (this.selectNodeCallback) !== "function") {
            return;
        }

        this.selectNodeCallback(node);
    };    
    

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~ExplorerTool()");

        this.tools.dispose();
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