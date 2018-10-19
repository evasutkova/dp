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
        this._fileBrowser_openAction = ko.observable();
        this._drive_disconnectAction = ko.observable();
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Otvorí a načíta dokument z disku.
     */
    Model.prototype.open = function () {
        var $this = this;

        this.browse("Ovoriť projekt", "Názov súboru", "arrayBuffer", ".mdzip", false, "Otvoriť", "Zrušiť")
            .then(function (data) {
                // Ak prislo null pouzivatel zrusil okno
                if(!data) {
                    return;
                }
                
                // Ak prislo prazdne pole pouizvatel nevybral ziadensubor
                if (!data.length) {
                    $this.confirm("Otvoriť projekt", "Musíte vybrať súbor s príponou <b>.mdzip</b> alebo <b>.md</b>.", "Ok");
                    return;
                }

                // // Try to parse content
                // var parsedData;
                // try {
                //     parsedData = JSON.parse(data.content);
                // }
                // catch (ex) {
                //     $this.alert($this.resources.openHelp.errors.invalidFormat);
                //     return;
                // }

                // $this._openHelp(data.content, data.fileName);
            });
    };


    /**
     * Odhlási používateľa.
     */
    Model.prototype.disconnect = function () {
        var $this = this;
        this.confirm("Odhlásenie", "Naozaj chcete ukončiť prácu s aplikáciou?", "Odhlásiť", "Pokračovať")
            .then(function(r) {
                if(!r) {
                    return;
                }

                var action = $this._drive_disconnectAction();

                if (typeof (action) !== "function") {
                    console.error("App : disconnect() : Akcia pre odhlásenie nie je definovaná.");
                    return;
                }
        
                $this.tool("");
                action();
            });
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
     * Zobrazí dialóg pre otvorenie súboru.
     * 
     * @param {string} title Nadpis.
     * @param {string} text Text.
     * @param {string} mode Mód.
     * @param {string} accept Typ súborov.
     * @param {boolean} multiple Ak je true je možné vybrať viacero súborov naraz.
     * @param {string} yes Text pre potvrdenie.
     * @param {string} no Text pre zrušenie.
     */
    Model.prototype.browse = function (title, text, mode, accept, multiple, yes, no) {
        var action = this._fileBrowser_openAction();

        if (typeof (action) !== "function") {
            console.error("App : browse() : Akcia pre otvorenie file browse dialógu nie je definovaná.");
            return;
        }

        return action(title, text, mode, accept, multiple, yes, no);
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
        return global.app;
    };

    //#endregion

    return {
        viewModel: { createViewModel: Model.createViewModel },
        template: view
    };
});