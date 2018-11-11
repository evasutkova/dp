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

        this.addNodeCallback = args.addNodeCallback;
        this.deleteNodeCallback = args.deleteNodeCallback;
        this.renameNodeCallback = args.renameNodeCallback;
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

        return [
            renameAction,
            deleteAction
        ];
    };    

/*
    Model.prototype.activeNodeTools = function (node) {
        if (!node) {
            return [];
        }

        // Action for node movement
        var moveNodeFnc = function (source, target) {
            if (typeof ($this._replaceNodeCallback) === "function") {
                $this._replaceNodeCallback(source, target);
            }
        };

        // Prepare list of candidates for node movement
        var candidates = [];
        if (node.parent.parent) {
            candidates.push({
                text: node.parent.parent.title(),
                action: moveNodeFnc,
                source: node,
                target: node.parent.parent
            });
            node.parent.parent.nodes().forEach(function (n) {
                if (n == node.parent) {
                    return;
                }
                candidates.push({
                    text: n.title(),
                    action: moveNodeFnc,
                    source: node,
                    target: n
                });
            });
        }
        node.parent.nodes().forEach(function (n) {
            if (n == node) {
                return;
            }
            candidates.push({
                text: n.title(),
                action: moveNodeFnc,
                source: node,
                target: n
            });
        });

        return [{
            text: "explorer-tool.keywords",
            icon: "label",
            isEnabled: true,
            action: function (n) {
                if (typeof ($this._keywordsNodeCallback) === "function") {
                    $this._keywordsNodeCallback(n);
                }
            }
        }, {
            text: "explorer-tool.move-up",
            icon: "arrow_upward",
            isEnabled: node.canMoveUp(),
            action: function (n) {
                if (typeof ($this._moveNodeCallback) === "function") {
                    $this._moveNodeCallback(n, n.index() - 1);
                }
            }
        }, {
            text: "explorer-tool.move-down",
            icon: "arrow_downward",
            isEnabled: node.canMoveDown(),
            action: function (n) {
                if (typeof ($this._moveNodeCallback) === "function") {
                    $this._moveNodeCallback(n, n.index() + 1);
                }
            }
        }, {
            text: "explorer-tool.move-to",
            icon: "call_merge",
            isEnabled: candidates.length > 0,
            action: function (n) {
            },
            tools: candidates
        }];
    };
*/

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