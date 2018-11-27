define([
    "require",
    "module",
    "knockout",
    "text!./new-project.html",
    "dp/bindings/optiscroll"
], function (require, module, ko, view) {
    //#region [ Fields ]
    
    var cnf = module.config();
    
    //#endregion


    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("NewProject()");
        
        this.items = cnf.templates;
        this.activeItem = ko.observable();
        this.value = ko.observable("");
        
        this.closeCallback = args.closeCallback;
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vyberie šablónu.
     * 
     * @param {object} item Šablóna.
     */
    Model.prototype.select = function (item) {
        this.activeItem(item);
    };  


    /**
     * Url pre šablónu.
     * 
     * @param {object} item Šablóna.
     */
    Model.prototype.thumnailUrl = function (item) {
        return "url('" + require.toUrl(item.thumnail) + "')";
    };    
    

    /**
     * Zavrie okno.
     */
    Model.prototype.close = function () {
        if(typeof(this.closeCallback) === "function") {
            this.closeCallback(false);
        }
    };


    /**
     * Zavrie okno a vytvorí nový projekt.
     */
    Model.prototype.create = function () {
        if(typeof(this.closeCallback) === "function") {
            this.closeCallback({
                filename: this.value(),
                url: (this.activeItem() || {}).url
            });
        }
    };
    

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~NewProject()");
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