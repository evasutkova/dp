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
        this.hasMeta = args.hasMeta || ko.observable(false);
        this.hasTemplate = args.hasTemplate || ko.observable(false);
        
        this.disconnectCallback = args.disconnectCallback;
        this.openCallback = args.openCallback;
        this.previewCallback = args.previewCallback;
        this.saveCallback = args.saveCallback;
        this.downloadCallback = args.downloadCallback;
        this.newProjectCallback = args.newProjectCallback;
    };

    //#endregion


    //#region [ Methods : Public ]
    
    /**
     * Vyvolá dialóg pre vytvorenie nového súboru.
     */
    Model.prototype.newProject = function () {
        if(typeof(this.newProjectCallback) === "function") {
            this.newProjectCallback();
        }
    };    
    
    
    /**
     * Vyvolá dialóg pre otvorenie súboru.
     */
    Model.prototype.open = function () {
        if(typeof(this.openCallback) === "function") {
            this.openCallback();
        }
    };


    /**
     * Zobrazí náhľad výstupu.
     */
    Model.prototype.preview = function () {
        if(typeof(this.previewCallback) === "function") {
            this.previewCallback();
        }
    }; 
    
    
    /**
     * Uloží projekt.
     */
    Model.prototype.save = function () {
        if(typeof(this.saveCallback) === "function") {
            this.saveCallback();
        }
    };


    /**
     * Uloží výstup projekt.
     */
    Model.prototype.download = function () {
        if(typeof(this.downloadCallback) === "function") {
            this.downloadCallback();
        }
    };    
    

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
        if(typeof(this.disconnectCallback) === "function") {
            this.disconnectCallback();
        }
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