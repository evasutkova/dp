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

        this._signedIn_subscribe = null;
        this._currentUser_subscribe = null;

        this.user = args.user || ko.observable(null);
        this.isConnected = args.isConnected || ko.observable(false);
        this.isConnecting = ko.observable(false);
        this.errorMessage = ko.observable("");

        if (typeof (args.disconnectAction) === "function") {
            args.disconnectAction(this.disconnect.bind(this));
        }
    };

    //#endregion


    //#region [ Event Handlers ]

    /**
     * Spracovanie udalosti pripojenia na Google Drive.
     */
    Model.prototype._onConnectSuccess = function () {
        if(!this._signedIn_subscribe) {
            this._signedIn_subscribe = api.auth2.getAuthInstance().isSignedIn.listen(this._onSignedIn.bind(this));
        }
        if(!this._currentUser_subscribe) {
            this._currentUser_subscribe = api.auth2.getAuthInstance().currentUser.listen(this._onCurrentUser.bind(this));
        }
        
        var isSignedIn = api.auth2.getAuthInstance().isSignedIn.get();
        if(isSignedIn) {
            this.isConnected(true);
            this.isConnecting(false);
            this._onSignedIn(true);
            this._onCurrentUser(api.auth2.getAuthInstance().currentUser.get());
            return;
        }

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
    
    
    /**
     * Spracovanie udalosti zmeny prihláseného používateľa.
     * 
     * @param {object} googleUser Inštancia google usera.
     */
    Model.prototype._onCurrentUser = function (googleUser) {
        if(!googleUser.isSignedIn()) {
            this.user(null);
            return;
        }        

        var profile = googleUser.getBasicProfile();
        this.user({
            name: profile.getName(),
            imageUrl: profile.getImageUrl(),
            email: profile.getEmail()
        });
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
	 * Odpojenie na Google Drive.
	 */
    Model.prototype.disconnect = function () {
        if(this._signedIn_subscribe) {
            this._signedIn_subscribe.remove();
            this._signedIn_subscribe = null;
        }
        if(this._currentUser_subscribe) {
            this._currentUser_subscribe.remove();
            this._currentUser_subscribe = null;
        }
        
        this.isConnecting(false);
        this.isConnected(false);
        this.user(null);
        this.errorMessage("");
        api.auth2.getAuthInstance().signOut();
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