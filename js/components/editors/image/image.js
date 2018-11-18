define([
    "knockout",
    "text!./image.html",
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
        console.log("ImageEditor()");

        this.items = args.items || ko.observableArray([]);
        this.activeImage = args.activeImage || ko.observable(null);
        this.tools = ko.computed(this._tools, this);

        this.selectImageCallback = args.selectImageCallback;
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Zoznam dostupných nástrojov pre aktívny uzol.
     */
    Model.prototype._tools = function() {
        var img = this.activeImage();
        if(!img) {
            return [];
        }

        // Premenovanie
        var renameAction = {
            image: img,
            text: "Premenovať",
            icon: "rename_box",
            isEnabled: true,
            action: (function (e) {
                // if (typeof (this.renameNodeCallback) !== "function") {
                //     return;
                // }

                // var $this = this;
                // this.renameNodeCallback(e.node).then(function(node) {
                //     if(!node) {
                //         return;
                //     }
                //     $this.select(node);
                // });                
            }).bind(this)
        };

        // Vymazanie
        var deleteAction = {
            image: img,
            text: "Vymazať",
            icon: "delete",
            isEnabled: true,
            action: (function (e) {
                // if (typeof (this.deleteNodeCallback) !== "function") {
                //     return;
                // }

                // var $this = this;
                // this.deleteNodeCallback(e.node).then(function(node) {
                //     if (!node) {
                //         return;
                //     }
                //     var parent = node.parent || null;
                //     if(parent) {
                //         parent.isExpanded(true);
                //     }
                //     $this.select(parent);
                // });
            }).bind(this)
        };
  
        return [
            renameAction,
            deleteAction
        ];
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vyberie obrázok.
     * 
     * @param {object} image Obrázok.
     */    
    Model.prototype.select = function (image) {
        if (typeof (this.selectImageCallback) !== "function") {
            return;
        }

        this.selectImageCallback(image);
    };


    /**
     * Zobrazí obrázok.
     * 
     * @param {object} image Obrázok.
     */    
    Model.prototype.show = function (image) {
        console.info("show");
    };    


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~ImageEditor()");

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