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
            }),
            new Resource({
                title: "Číslovaný zoznam",
                url: "1. Prvá položka.\n" +
                     "2. Ďalšia položka.\n" + 
                     "    * Nečíslovaný zoznam.\n" + 
                     "1. Nezáleží na čísle.\n" +
                     "    1. Číslovaný zoznam.\n" + 
                     "4. A ďalšia položka.\n"
            }),
            new Resource({
                title: "Zoznam úloh",
                url: "- [x] Ukončená úloha\n" +
                     "- [ ] **Neukončená** úloha"
            }),
            new Resource({
                title: "Odkazy, linky",
                url: "[v texte](https://google.sk)"
            }),
            new Resource({
                title: "Odkazy, linky spopisom",
                url: "[s popisom](https://google.sk \"Google\")"
            }),            
            new Resource({
                title: "Odkazy, linky v dokumente",
                url: "[v dokumente](#uvod)"
            }),
            new Resource({
                title: "Odkazy, linky referenciou",
                url: "cez [referenciu][linka]\n\n" +
                     "[linka]: http://google.sk"
            }),            
            new Resource({
                title: "Obrázky",
                url: "![popis](http://bit.ly/2yMs2c1 \"nadpis\")"
            }),            
            new Resource({
                title: "Obrázky referenciou",
                url: "![popis][logo]\n\n" +
                     "[logo]: http://bit.ly/2yMs2c1 \"nadpis\""
            }) 
        ]);
        this.search = ko.observable(session.get("search") || "").extend({ rateLimit: 350 });
        this.filtered = ko.computed(this._filtered, this);

        this.insertMarkdownCallback = args.insertMarkdownCallback;
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
     * Vloží markdown do textu.
     * 
     * @param {string} markdow Markdown text.
     */
    Model.prototype.insert = function (markdow) {
        if (typeof (this.insertMarkdownCallback) !== "function") {
            return;
        }

        this.insertMarkdownCallback(markdow);
    };

    
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