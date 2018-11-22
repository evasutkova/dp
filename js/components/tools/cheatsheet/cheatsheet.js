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
                url: "[v texte](https://url.sk)"
            }),
            new Resource({
                title: "Odkazy, linky spopisom",
                url: "[popisom](https://url.sk \"\")"
            }),            
            new Resource({
                title: "Odkazy, linky v dokumente",
                url: "[v dokumente](#uvod)"
            }),
            new Resource({
                title: "Odkazy, linky referenciou",
                url: "cez [referenciu][linka]\n\n" +
                     "[linka]: http://url.sk"
            }),            
            new Resource({
                title: "Obrázky",
                url: "![popis](http://url.sk \"\")"
            }),            
            new Resource({
                title: "Obrázky referenciou",
                url: "![popis][logo]\n\n" +
                     "[logo]: http://url.sk \"\""
            }),            
            new Resource({
                title: "Obrázky s nadpisom",
                url: "![popis](http://url.sk)\n" +
                     "###### Nadpis"
            }),            
            new Resource({
                title: "Zdrojový kód",
                url: "`var x = 1;`"
            }),            
            new Resource({
                title: "Blok zdrojového kódu",
                url: "```javascript\n" +
                     "var s = \"string\"\n" +
                     "alert(s);\n" +
                     "```"
            }),            
            new Resource({
                title: "Tabuľka",
                url: "| A  | B    | C   |\n" +
                     "|----|:----:|----:|\n" +
                     "|left|center|right|"
            }),            
            new Resource({
                title: "Tabuľka s nadpisom",
                url: "| A  | B    | C   |\n" +
                     "|----|:----:|----:|\n" +
                     "|left|center|right|\n" +
                     "###### Nadpis"
            }),            
            new Resource({
                title: "Blockquotes",
                url: "> Blockquotes sú vhodné\n" +
                     "> napríklad pre zvýraznenie"
            }),
            new Resource({
                title: "Horizontálna čiara",
                url: "***"
            }),            
            new Resource({
                title: "Inline HTML",
                url: "<dl>\n" +
                     "  <dt>Definition</dt>\n" +
                     "  <dd>list.</dd>\n" +
                     "</dl>"
            }),            
            new Resource({
                title: "YouTube",
                url: "<a href=\"...&v=ID\">\n" +
                     "  <img src=\"...ID/0.jpg\" />\n" +
                     "</a>"
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
     * @param {object} resource Resource.
     */
    Model.prototype.insert = function (resource) {
        if (typeof (this.insertMarkdownCallback) !== "function") {
            return;
        }

        this.insertMarkdownCallback(resource.search());
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