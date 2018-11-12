define([
    "knockout",
    "jszip",
    "text!./app.html",
    "dp/document/node",
    "dp/polyfills/array"
], function (ko, zip, view, Node) {
    //#region [ Fields ]

    var global = (function() { return this; })();
    var loader = null;

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
        this._window_openAction = ko.observable();
        this._window_closeAction = ko.observable();
        this._drive_disconnectAction = ko.observable();
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Vytvorí novú položku.
     * 
     * @param {string} title Nadpis.
     * @param {object} parent Nadradený uzol.
     */
    Model.prototype._addNode = function (title, parent) {
        // Novy uzol
        var n;

        if (parent) {
            n = parent.add(title);
        }
        else {
            n = new Node({
                title: title
            });
            this.nodes.push(n);
        }

        // Vytvorime default obsah
        var level = "#";
        var p = n.parent;
        while (p) {
            level += "#";
            p = p.parent;
        }
        n.content(level + " " + title);

        return n;
    };


    /**
     * Vymaže položku.
     * 
     * @param {object} node Uzol, ktorý sa má vymazať.
     */
    Model.prototype._deleteNode = function (node) {
        var parent = node.parent || null;
        if (parent) {
            parent.remove(node);
        }

        this.nodes.remove(node);
        return node;
    };


    /**
     * Premenuje položku.
     * 
     * @param {string} title Nadpis.
     * @param {object} node Nadradený uzol.
     */
    Model.prototype._renameNode = function (title, node) {
        node.title(title);
        return node;
    };


    /**
     * Presunie uzol na novú pozíciu.
     * 
     * @param {array} nodes Zoznam uzlov, ktorom sa nachádza uzol.
     * @param {object} node Uzol, ktorý treba presunúť.
     * @param {number} from Index z ktorého treba uzol posunúť.
     * @param {number} to Index na ktorý treba uzol posunúť.
     */
    Model.prototype._moveNode = function(nodes, node, from, to) {
        nodes().move(from, to);
    };     
    

    /**
     * Nastaví kľúčové slová pre uzol.
     * 
     * @param {array} keywords Kľúčové slová.
     * @param {object} node Uzol.
     */
    Model.prototype._keywordsNode = function(keywords, node) {
        node.keywords(keywords.join(","));
    }; 


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
            var tmp = new Node({
                parent: parent,
                title: n.title,
                content: n.content,
                keywords: n.keywords,
                isExpanded: n.isExpanded,
                isActive: n.isActive
            });
            tmp.nodes($this._parseNodes(n.nodes, tmp));
            return tmp;
        });
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Zobrazí/skryje loader.
     *
     * @param {boolean} isLoading Ak je true tak sa loader zobrazí inak sa skryje.
     * @param {string} title Text - nadpis.
     * @param {string} cancelText Text pre tlačidlo zrušiť.
     */
    Model.prototype.loading = function (isLoading, title, cancelText) {
        if (isLoading) {
            if (loader) {
                loader.close();
                loader = null;
            }

            loader = this.window("loader", { title: title, cancelText: cancelText });
            return loader.open();
        }

        if(loader) {
            loader.close();
            loader = null;
        }
    };


    /**
     * Vytvorí nový uzol a pridá ho do zoznamu uzlov pre vstupný uzol.
     * 
     * @param {object} node Uzol pre ktorý sa má pridať nový uzol.
     */
    Model.prototype.addNode = function(node) {
        var $this = this;

        return this.prompt("Nová položka", "Zadajte názov novej položky", "", "Vytvoriť", "Zrušiť")
            .then(function(title) {
                if(title === null) {
                    return null;
                }

                if(!title) {
                    return $this.confirm("Nová položka", "Musíte zadať názov pre novú položku.", "Ok").then(function() {
                        return $this.addNode(node);
                    });
                }
                
                return $this._addNode(title, node);
            });
    };


    /**
     * Vymaže uzol.
     * 
     * @param {object} node Uzol ktorý sa má vymazať.
     */
    Model.prototype.deleteNode = function(node) {
        var $this = this;
        return this.confirm("Vymazať položku", "Chcete vymazať položku <b>" + node.title() + "</b>?", "Vymazať", "Zrušiť")
            .then(function(r) {
                if(!r) {
                    return;
                }
                
                return $this._deleteNode(node);
            });
    };


    /**
     * Premenuje uzol.
     * 
     * @param {object} node Uzol ktorý sa má premenovať.
     */
    Model.prototype.renameNode = function(node) {
        var $this = this;
        return this.prompt("Premenovať položku", "Zadajte nový názov pre položku <b>" + node.title() + "</b>", node.title(), "Premenovať", "Zrušiť")
            .then(function(title) {
                if(title === null) {
                    return null;
                }

                if(!title) {
                    return $this.confirm("Premenovať položku", "Musíte zadať názov.", "Ok").then(function() {
                        return $this.renameNode(node);
                    });
                }
                
                return $this._renameNode(title, node);
            });        
    };    
    

    /**
     * Presunie uzol na novú pozíciu.
     * 
     * @param {object} node Uzol, ktorý treba presunúť.
     * @param {number} from Index z ktorého treba uzol posunúť.
     * @param {number} to Index na ktorý treba uzol posunúť.
     */
    Model.prototype.moveNode = function(node, from, to) {
        var nodes = node.parent ? node.parent.nodes : this.nodes;
        this._moveNode(nodes, node, from, to);
        nodes.valueHasMutated();        
    };


    /**
     * Nastaví kľúčové slová pre uzol.
     * 
     * @param {object} node Uzol.
     */
    Model.prototype.keywordsNode = function(node) {
        var $this = this;
        return this.prompt("Kľúčové slová", "Zadajte kľúčové slová oddelené čiarkou", node.keywords(), "Nastaviť", "Zrušiť")
            .then(function(keywords) {
                keywords = (keywords || "")
                    .split(",")
                    .map(function(kw) {
                        return kw.trim();
                    })
                    .filter(function(kw) {
                        return kw.length > 0;
                    });
                return $this._keywordsNode(keywords, node);
            });  
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
     * Zobrazí modálne okno.
     * 
     * @param {string} component Názov komponentu.
     * @param {object} params Parametre komponentu.
     */
    Model.prototype.window = function (component, params) {
        var openAction = this._window_openAction();
        
        if (typeof (openAction) !== "function") {
            console.error("App : window() : Akcia pre otvorenie modálneho dialógu nie je definovaná.");
            return;
        }

        var closeAction = this._window_closeAction();
        
        if (typeof (closeAction) !== "function") {
            console.error("App : window() : Akcia pre zatvorenie modálneho dialógu nie je definovaná.");
            return;
        }        
        
        return {
            open: function() {
                return openAction(component, params);
            },
            close: function() {
                closeAction(true);
            }
        };
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