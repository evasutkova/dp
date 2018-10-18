define([
    "knockout",
    "text!./app.html"
], function (ko, view) {
    //#region [ Fields ]

    var global = (function() { return this; })();

    //#endregion
    
    
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("App()");

        this.isConnected = ko.observable(false);
        this.tool = ko.observable("");
        this.user = ko.observable(null);
        this.files = ko.observableArray([]);

        this._prompt_openAction = ko.observable();
        this._confirm_openAction = ko.observable();
        this._drive_disconnectAction = ko.observable();
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Odhlási používateľa.
     */
    Model.prototype.disconnect = function () {
        var action = this._drive_disconnectAction();

        if (typeof (action) !== "function") {
            console.error("App : disconnect() : Akcia pre odhlásenie nie je definovaná.");
            return;
        }

        this.tool("drive");
        action();
    };


    /**
     * Zobrazí prompt.
     * 
     * @param {string} title Nadpis.
     * @param {string} text Text.
     * @param {string} value Základná hodnota.
     * @param {string} yes Text pre potvrdenie.
     * @param {string} no Text pre zrušenie.
     */
    Model.prototype.prompt = function (title, text, value, yes, no) {
        var action = this._prompt_openAction();

        if (typeof (action) !== "function") {
            console.error("App : prompt() : Akcia pre otvorenie prompt dialógu nie je definovaná.");
            return;
        }

        return action(title, text, value, yes, no);
    };


    /**
     * Zobrazí confirm.
     * 
     * @param {string} title Nadpis.
     * @param {string} text Text.
     * @param {string} yes Text pre potvrdenie.
     * @param {string} no Text pre zrušenie.
     */
    Model.prototype.confirm = function (title, text, yes, no) {
        var action = this._confirm_openAction();

        if (typeof (action) !== "function") {
            console.error("App : confirm() : Akcia pre otvorenie confirm dialógu nie je definovaná.");
            return;
        }

        return action(title, text, yes, no);
    };    

    
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~App()");
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
        global.app = new Model(params, componentInfo);
        app.tool("drive");
        return global.app;
    };

    //#endregion

    return {
        viewModel: { createViewModel: Model.createViewModel },
        template: view
    };
});