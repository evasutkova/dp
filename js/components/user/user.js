define([
    "knockout",
    "text!./user.html"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("User()");

        this.user = args.user || ko.observable(null);
        this.imageUrl = ko.computed(this._imageUrl, this);
        this.name = ko.computed(this._name, this);
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vráti image url.
     */
    Model.prototype._imageUrl = function () {
        var user = this.user();
        if(!user) {
            return "";
        }

        return user.imageUrl;
    };


    /**
     * Vráti meno používateľa.
     */
    Model.prototype._name = function () {
        var user = this.user();
        if(!user) {
            return "";
        }

        return user.name;
    };    

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~User()");

        this.imageUrl.dispose();
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