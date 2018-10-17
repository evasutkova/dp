define([
    "module",
    "knockout",
    "google!client:auth2",
    "text!./drive.html"
], function (module, ko, api, view) {
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
        console.log("DriveTool()");

        this.isConnected = args.isConnected || ko.observable(false);
        this.isConnecting = ko.observable(false);
        this.errorMessage = ko.observable("");
    };

    //#endregion


    //#region [ Event Handlers ]

    /**
     * Spracovanie udalosti pripojenia na Google Drive.
     */
    Model.prototype._onConnectSuccess = function () {
        var isSignedIn = api.auth2.getAuthInstance().isSignedIn.get();
        if(isSignedIn) {
            this.isConnected(true);
            this.isConnecting(false);
            return;
        }

        api.auth2.getAuthInstance().isSignedIn.listen(this._onSignedIn.bind(this));
        api.auth2.getAuthInstance().signIn();
    };


    /**
     * Spracovanie udalosti neúspešného pripojenia na Google Drive.
     * 
     * @param {object} e Argumenty udalosti.
     */
    Model.prototype._onConnectError = function (e) {
        this.isConnected(false);
        this.isConnecting(false);
        this.errorMessage("Nepodarilo sa pripojiť na Google Drive");
        console.error("DriveTool : connect() : %o", e.error);
    };    


    /**
     * Spracovanie udalosti prihlásenia.
     * 
     * @param {boolean} isSignedIn Ak nastavené na true, tak prebehlo úspešné prihlásenie.
     */
    Model.prototype._onSignedIn = function (isSignedIn) {
        if(this.isConnected() === isSignedIn) {
            return;
        }
        
        // this.nextPage("");
        // this.files([]);

        if(isSignedIn) {
            this.isConnected(true);
            this.isConnecting(false);
            //this.listFiles();
            return;
        }

        this.isConnecting(false);
        this.isConnected(false);
    };    
    
    //#endregion


    //#region [ Methods : Public ]

    /**
	 * Pripojenie na Google Drive.
	 */
    Model.prototype.connect = function () {
        this.isConnecting(true);
        
        api.client.init({
            apiKey: cnf.apiKey,
            clientId: cnf.clientId,
            discoveryDocs: cnf.discoveryDocs,
            scope: cnf.scopes.join(" ")
        }).then(this._onConnectSuccess.bind(this), this._onConnectError.bind(this));
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~DriveTool()");
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