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
                title: "Nadpis prvej úrovne",
                url: "# Nadpis prvej úrovne"
            }),
            new Resource({
                title: "Nadpis druhej úrovne",
                url: "## Nadpis druhej úrovne"
            }),
            new Resource({
                title: "Nadpis tretej úrovne",
                url: "### Nadpis tretej úrovne"
            }),                        
            new Resource({
                title: "Tučný text",
                url: "**bold**"
            }),
            new Resource({
                title: "Šikmý text",
                url: "_italics_"
            }),
            new Resource({
                title: "Preškrtnutý text",
                url: "~~preškrtnutý text~~"
            }),
            new Resource({
                title: "Vstup z klávesnice",
                url: "~Ctrl~"
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
                url: "- [x] _Ukončená úloha_\n" +
                     "- [ ] _**Neukončená** úloha_"
            }),
            new Resource({
                title: "Zoznam úloh 2",
                url: "- [x] **Ukončená úloha**\n" +
                     "- [ ] **__Neukončená__ úloha**"
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
                     "###### Nadpis {obrazok-1}"
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
                title: "Blok zdrojového kódu s nadpisom",
                url: "```javascript\n" +
                     "var s = \"string\"\n" +
                     "alert(s);\n" +
                     "```\n" +
                     "###### Nadpis {kod-1}"
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
                     "###### Nadpis {tabulka-1}"
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
                url: "<a href=\"..&v=ID\">\n" +
                     "  <img src=\"..ID/0.jpg\" />\n" +
                     "</a>"
            }),            
            new Resource({
                title: "YouTube Markdown",
                url: "[![alt](url)](url)"
            }),            
            new Resource({
                title: "UML",
                url: "```uml\n" +
                     "[nomnoml] is->[great]\n" +
                     "```"
            }),            
            new Resource({
                title: "UML s nadpisom",
                url: "```uml\n" +
                     "[nomnoml] is->[great]\n" +
                     "```\n" +
                     "###### Nadpis {obrazok-1}"
            }),            
            new Resource({
                title: "Poznámka pod čiarou",
                url: "[^n](Text.)"
            }),            
            new Resource({
                title: "JsFiddle",
                url: "```jsfiddle\n" +
                     "m7qck23r\n" +
                     "js,html,css,result\n" +
                     "dark\n" +
                     "```"
            }),
            new Resource({
                title: "JsFiddle Light",
                url: "```jsfiddle\n" +
                     "m7qck23r\n" +
                     "js,html,css,result\n" +
                     "light\n" +
                     "300,200\n" +
                     "```"
            }),
            new Resource({
                title: "iFrame",
                url: "```iframe\n" +
                     "https://www.google.sk\n" +
                     "300,200\n" +
                     "```"
            })
        ]);
        this.search = ko.observable(session.get("search") || "").extend({ rateLimit: 350 });
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
        var insert = this.insertMarkdownCallback;
        var select = this.selectMarkdownCallback;
        
        if ((typeof (insert) !== "function") || (typeof (select) !== "function")){
            return;
        }

        var id = resource.search();
        var p;

        switch(id) {
            case "nadpis_prvej_urovne":
                p = insert("# Nadpis");
                select({ line: p.from.line, ch: p.from.ch + 2 }, p.to);
                return;
            case "nadpis_druhej_urovne":
                p = insert("## Nadpis");
                select({ line: p.from.line, ch: p.from.ch + 3 }, p.to);
                return;
            case "nadpis_tretej_urovne":
                p = insert("### Nadpis");
                select({ line: p.from.line, ch: p.from.ch + 4 }, p.to);
                return;
            case "tucny_text":
                p = insert("**text**");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.to.line, ch: p.to.ch - 2 });
                return;
            case "sikmy_text":
                p = insert("_text_");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.to.line, ch: p.to.ch - 2 });
                return;
            case "preskrtnuty_text":
                p = insert("~~text~~");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.to.line, ch: p.to.ch - 2 });
                return;
            case "vstup_z_klavesnice":
                p = insert("~Ctrl~");
                select({ line: p.from.line, ch: p.from.ch + 1 }, { line: p.to.line, ch: p.to.ch - 1 });
                return;                
            case "cislovany_zoznam":
                p = insert("1. Prvá položka.\n" +
                           "2. Ďalšia položka.\n" + 
                           "    * Nečíslovaný zoznam.\n" + 
                           "1. Nezáleží na čísle.\n" +
                           "    1. Číslovaný zoznam.\n" + 
                           "4. A ďalšia položka.");
                select({ line: p.from.line, ch: p.from.ch + 3 }, { line: p.from.line, ch: p.from.ch + 16 });
                return;
            case "zoznam_uloh":
                p = insert("- [x] _Ukončená úloha_");
                select({ line: p.from.line, ch: p.from.ch + 7 }, { line: p.to.line, ch: p.to.ch - 1});
                return;
            case "zoznam_uloh_":
                p = insert("- [x] **Ukončená úloha**");
                select({ line: p.from.line, ch: p.from.ch + 8 }, { line: p.to.line, ch: p.to.ch - 2});
                return;                
            case "odkazy_linky":
                p = insert("[odkaz](https://www.google.sk)");
                select({ line: p.from.line, ch: p.from.ch + 1 }, { line: p.from.line, ch: p.from.ch + 6 });
                return;
            case "odkazy_linky_spopisom":
                p = insert("[odkaz](https://www.google.sk \"Popis\")");
                select({ line: p.from.line, ch: p.from.ch + 1 }, { line: p.from.line, ch: p.from.ch + 6 });
                return;
            case "odkazy_linky_v_dokumente":
                p = insert("[odkaz](#uvod)");
                select({ line: p.from.line, ch: p.from.ch + 1 }, { line: p.from.line, ch: p.from.ch + 6 });
                return;
            case "odkazy_linky_referenciou":
                p = insert("[odkaz][linka]\n\n" +
                           "[linka]: http://www.google.sk");
                select({ line: p.from.line, ch: p.from.ch + 1 }, { line: p.from.line, ch: p.from.ch + 6 });
                return;
            case "obrazky":
                p = insert("![logo](https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png \"Google logo\")");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.from.line, ch: p.from.ch + 6 });
                return;
            case "obrazky_referenciou":
                p = insert("![popis][logo]\n\n" +
                           "[logo]: https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png \"Google logo\"");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.from.line, ch: p.from.ch + 7 });
                return;
            case "obrazky_s_nadpisom":
                p = insert("![logo](https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png \"Google logo\")\n" +
                           "###### Google logo {obrazok-google}");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.from.line, ch: p.from.ch + 6 });
                return;
            case "zdrojovy_kod":
                p = insert("`var x = 1;`");
                select({ line: p.from.line, ch: p.from.ch + 1 }, { line: p.to.line, ch: p.to.ch - 1 });
                return;
            case "blok_zdrojoveho_kodu":
                p = insert("```javascript\n" +
                           "var s = \"string\"\n" +
                           "alert(s);\n" +
                           "```");
                select({ line: p.from.line, ch: p.from.ch + 3 }, { line: p.from.line, ch: p.from.ch + 13 });
                return;
            case "blok_zdrojoveho_kodu_s_nadpisom":
                p = insert("```javascript\n" +
                           "var s = \"string\"\n" +
                           "alert(s);\n" +
                           "```\n" +
                           "###### Nadpis {kod-1}");
                select({ line: p.from.line, ch: p.from.ch + 3 }, { line: p.from.line, ch: p.from.ch + 13 });
                return;
            case "tabulka":
                p = insert("| A  | B    | C   |\n" +
                           "|----|:----:|----:|\n" +
                           "|left|center|right|");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.from.line, ch: p.from.ch + 3 });
                return;
            case "tabulka_s_nadpisom":
                p = insert("| A  | B    | C   |\n" +
                           "|----|:----:|----:|\n" +
                           "|left|center|right|\n" +
                           "###### Nadpis {tabulka-1}");
                select({ line: p.from.line, ch: p.from.ch + 2 }, { line: p.from.line, ch: p.from.ch + 3 });
                return;
            case "blockquotes":
                p = insert("> Blockquotes");
                select({ line: p.from.line, ch: p.from.ch + 2 }, p.to);
                return;
            case "horizontalna_ciara":
                p = insert("\n***\n");
                return;
            case "inline_html":
                p = insert("<dl>\n" +
                           "\t<dt>Definition</dt>\n" +
                           "\t<dd>list.</dd>\n" +
                           "</dl>");
                select({ line: p.from.line + 1, ch: p.from.ch + 5 }, { line: p.from.line + 1, ch: p.from.ch + 15 });                           
                return;
            case "youtube":
                p = insert("<a href=\"https://www.youtube.com/watch?feature=player_embedded&v=O3rpmctmC_M\" target=\"_blank\">\n" +
                           "\t<img src=\"https://img.youtube.com/vi/O3rpmctmC_M/0.jpg\" alt=\"Popis\" width=\"240\" height=\"180\" />\n" +
                           "</a>");
                select({ line: p.from.line, ch: p.from.ch + 66 }, { line: p.from.line, ch: p.from.ch + 77 });
                return;
            case "youtube_markdown":
                p = insert("[![Popis](https://img.youtube.com/vi/O3rpmctmC_M/0.jpg)](https://www.youtube.com/watch?v=O3rpmctmC_M)");
                select({ line: p.from.line, ch: p.from.ch + 37 }, { line: p.from.line, ch: p.from.ch + 48 });
                return;
            case "uml":
                p = insert("```uml\n" +
                           "[nomnoml] is->[great]\n" +
                           "```");
                select({ line: p.from.line + 1, ch: 0 }, { line: p.from.line + 1, ch: 21 });
                return;
            case "uml_s_nadpisom":
                p = insert("```uml\n" +
                           "[nomnoml] is->[great]\n" +
                           "```\n" +
                           "###### Nadpis {obrazok-diagram}");
                select({ line: p.from.line + 1, ch: 0 }, { line: p.from.line + 1, ch: 21 });
                return;
            case "poznamka_pod_ciarou":
                p = insert("[^n](Poznámka pod čiarou.)");
                select({ line: p.from.line, ch: p.from.ch + 5 }, { line: p.to.line, ch: p.to.ch - 1 });
                return;
            case "jsfiddle":
                p = insert("```jsfiddle\n" +
                           "m7qck23r\n" +
                           "js,html,css,result\n" +
                           "dark\n" +
                           "```");
                select({ line: p.from.line + 1, ch: 0 }, { line: p.from.line + 1, ch: 8 });            
                return;
            case "jsfiddle_light":
                p = insert("```jsfiddle\n" +
                           "m7qck23r\n" +
                           "js,html,css,result\n" +
                           "light\n" +
                           "300,200\n" +
                           "```");
                select({ line: p.from.line + 1, ch: 0 }, { line: p.from.line + 1, ch: 8 });            
                return;
            case "iframe":
                p = insert("```iframe\n" +
                           "https://www.google.sk\n" +
                           "300,200\n" +
                           "```");
                select({ line: p.from.line + 1, ch: 0 }, { line: p.from.line + 1, ch: 21 });            
                return;                
            default:
                insert(id);
                return;
        }
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