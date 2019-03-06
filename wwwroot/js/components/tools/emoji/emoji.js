define([
    "knockout",
    "text!./emoji.html",
    "session!EmojiTool",
    "emoji",
    "dp/bindings/optiscroll"
], function (ko, view, session, icons) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("EmojiTool()");

        this.search = ko.observable(session.get("search") || "").extend({ rateLimit: 350 });
        this.items = ko.observableArray(icons);
        this.filtered = ko.computed(this._filtered, this);

        this.insertMarkdownCallback = args.insertMarkdownCallback;
        this.selectMarkdownCallback = args.selectMarkdownCallback;
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Filtrovaný zoznam.
     */
    Model.prototype._filtered = function() {
        var items = this.items();
        var search = this.search().toCodeName();

        if(!items.length) {
            return [];
        }

        return items.filter(function(r) {
            var found = r.n.indexOf(search) !== -1;

            (r.a || []).forEach(function(a) {
                found = found || (a.indexOf(search) !== -1);
            });

            return found;
        });
    };

    //#endregion    


    //#region [ Methods : Public ]

    /**
     * Vloží emoji do textu.
     * 
     * @param {object} emoji Emoji ikonka.
     */
    Model.prototype.insert = function (emoji) {
        var insert = this.insertMarkdownCallback;
        var select = this.selectMarkdownCallback;
        
        if ((typeof (insert) !== "function") || (typeof (select) !== "function")){
            return;
        }
        
        var p = insert(":" + emoji.n + ":");
        select(p.from, p.to);
    };

    
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~EmojiTool()");

        session.set({
            search: this.search()
        });

        this.filtered.dispose();
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