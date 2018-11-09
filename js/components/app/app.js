define([
    "knockout",
    "jszip",
    "text!./app.html"
], function (ko, zip, view) {
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
        this.editor = ko.observable("");

        this.title = ko.observable("");
        this.fileName = ko.observable("");
        this.template = ko.observable("").extend({ rateLimit: 500 });
        this.meta = ko.observableArray([]);
        this.nodes = ko.observableArray([]);
        
        this.activeNode = ko.observable(null);

        this._prompt_openAction = ko.observable();
        this._confirm_openAction = ko.observable();
        this._fileBrowser_openAction = ko.observable();
        this._drive_disconnectAction = ko.observable();
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Otvorí súbor/projekt.
     * 
     * @param {string} fileName Názov súboru.
     * @param {string} template HTML šablóna pre výstup.
     * @param {object} meta Metainformácie.
     * @param {array} nodes Uzly dokumentu.
     */
    Model.prototype._open = function(fileName, template, meta, nodes) {
        this.tool("explorer");
        this.editor("");
        this.title("");

        this.fileName(fileName);
        this.template(template);
        this.meta(this._parseMeta(meta));
        this.nodes(this._parseNodes(nodes, null));
    };


    /**
     * Spracovanie metadát.
     * 
     * @param {object} meta Metainformácie.
     */
    Model.prototype._parseMeta = function(meta) {
        return Object.keys(meta).map(function(key) {
            var m = meta[key];
            return {
                key: key,
                label: m.label,
                value: ko.observable(m.value),
                isProtected: key[0] === "@"
            };
        });
    };


    /**
     * Spracovanie uzlov dokumentu.
     * 
     * @param {array} nodes Uzly dokumentu.
     * @param {object} parent Nadradený uzol.
     */
    Model.prototype._parseNodes = function(nodes, parent) {
        if ((typeof(nodes) === "undefined") || !(nodes instanceof Array)) {
            return [];
        }
        
        var $this = this;

        return nodes.map(function(n) {
            var tmp = {
                parent: parent,
                title: ko.observable(n.title),
                content: ko.observable(n.content || ""),
                keywords: ko.observable(n.keywords || ""),
                isExpanded: ko.observable(n.isExpanded || false),
                isActive: ko.observable(n.isActive || false)
            };
            tmp.nodes = ko.observableArray($this._parseNodes(n.nodes, tmp));
            return tmp;
        });
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vytvorí nový uzol a pridá ho do zoznamu uzlov pre vstupný uzol.
     * 
     * @param {object} node Uzol pre ktorý sa má pridať nový uzol.
     */
    Model.prototype.addNode = function(node) {
        console.info("addNode");
    };


    /**
     * Otvorí a načíta dokument z disku.
     */
    Model.prototype.open = function () {
        var $this = this;

        var name = null;
        var archive = null;
        var template = null;
        var meta = null;
        var nodes = null;

        this.browse("Ovoriť projekt", "Názov súboru", "arrayBuffer", ".mdzip", false, "Otvoriť", "Zrušiť")
            .then(function (data) {
                // Ak prislo null pouzivatel zrusil okno
                if(!data) {
                    return Promise.reject(null);
                }
                
                // Ak prislo prazdne pole pouzivatel nevybral ziaden subor
                if (!data.length) {
                    throw "Musíte vybrať súbor s príponou <b>.mdzip</b>.";
                }

                // Odlozime nazov suboru
                name = data[0].name;
                return new zip().loadAsync(data[0].content);
            })
            .then(function(a) {
                // Odlozime archiv
                archive = a;

                // Nacitame sablonu
                return archive.file("template.html").async("string");
            })
            .then(function(r) {
                template = r;

                // Nacitame metainformacie
                return archive.file("meta.json").async("string");
            })
            .then(function(r) {
                meta = JSON.parse(r);

                // Nacitame uzly dokumentu
                return archive.file("nodes.json").async("string");
            })
            .then(function(r) {
                nodes = JSON.parse(r);
            })
            .then(function() {
                $this._open(name, template, meta, nodes);
            })
            .catch(function(error) {
                if(!error) {
                    return;
                }
                console.error(error);
                $this.confirm("Otvoriť projekt", (typeof(error) === "string") ? error : "Nepodarilo sa načítať obsah súboru.", "Ok");
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