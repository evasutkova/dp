define([
    "knockout",
    "text!./cheatsheet.html",
    "dp/document/resource",
    "session!CheatsheetTool",
    "dp/polyfills/string",
    "dp/bindings/optiscroll"
], function (ko, view, Resource, session) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("CheatsheetTool()");

        this.items = ko.observableArray([
            new Resource({
                title: "Nadpisy",
                url: "# Nadpis prvej úrovne\n" +
                     "## druhej úrovne\n" +
                     "### tretej\n" +
                     "#### atď"
            }),
            new Resource({
                title: "Zdôraznenie",
                url: "*italics* alebo _italics_\n" +
                     "**bold** alebo __bold__\n" +
                     "~~preškrtnutý text~~\n" +
                     "**bold a _italics_**"
            })            
        ]);
        this.search = ko.observable(session.get("search") || "").extend({ rateLimit: 350 });
        this.filtered = ko.computed(this._filtered, this);
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
            return r.search().indexOf(search) !== -1;
        });
    };

    //#endregion


    //#region [ Methods : Public ]
    
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~CheatsheetTool()");

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