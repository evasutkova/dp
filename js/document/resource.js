define([
    "knockout",
    "dp/polyfills/string"
], function (ko) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
	 */
    var Model = function (args) {
        console.log("Resource()");

        this.title = ko.observable(args.title || "");
        this.isActive = ko.observable(args.isActive || false);
        this.url = ko.observable(args.url || "");
        this.search = ko.computed(this._search, this);
    };

    //#endregion


    //#region [ Methods : Private ]
    
    /**
     * Získa názov obrázku pre vyhľadávanie.
     */
    Model.prototype._search = function () {
        var t = this.title();

        return t.toCodeName();
    };
    
    //#endregion    


    //#region [ Methods : Public ]

    /**
     * Vygeneruje JSON reprezentáciu.
     */
    Model.prototype.toJson = function() {
        var n = {
            title: this.title(),
            url: this.url(),
            search: this.search()
        };

        var tmp = this.isActive();
        if(tmp) {
            n.isActive = tmp;
        }
       
        return n;
    };

    
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~Resource()");

        this.search.dispose();
        //global.URL.revokeObjectURL(this.url);
    };

    //#endregion

    return Model;
});