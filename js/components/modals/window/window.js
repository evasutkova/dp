define([
    "knockout",
    "materialize",
    "text!./window.html"
], function (ko, M, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("WindowModal()");

        this._resolve = null;

        this.component = ko.observable("");
        this.params = ko.observable(null);
        this.modal = M.Modal.init(info.element.querySelector(".window-modal"), {
            dismissible: false
        });

        if (typeof (args.openAction) === "function") {
            args.openAction(this.open.bind(this));
        }
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Zobrazí modálne okno.
     * 
     * @param {string} component Názov komponentu.
     * @param {object} params Parametre komponentu.
     */
    Model.prototype.open = function (component, params) {
        params = params || {};

        params.closeCallback = this.close.bind(this);

        this.params(params);
        this.component(component || "");

        this.modal.open();

        var $this = this;
        return new Promise(function(resolve) {
            $this._resolve = resolve;
        });        
    };


    /**
     * Zavrie modálne okno.
     * 
     * @param {string} value Výsledok.
     */
    Model.prototype.close = function (value) {
        this.modal.close();

        if (this._resolve) {
            this._resolve(ko.unwrap(value));
            this._resolve = null;
        }
    };      


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~WindowModal()");
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