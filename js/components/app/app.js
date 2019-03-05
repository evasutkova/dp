define([
    "require",
    "knockout",
    "jszip",
    "filesaver",
    "tooltip",
    "text!./app.html",
    "dp/document/node",
    "dp/document/resource",
    "dp/polyfills/array"
], function (require, ko, zip, saveAs, tooltip, view, Node, Resource) {
    //#region [ Fields ]

    var global = (function() { return this; })();
    var loader = null;
    var previewWindow = null;
    var previewTimeout = null;
    var previewDuration = 5000;

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
        this.images = ko.observableArray([]);
        this.scripts = ko.observableArray([]);
        
        this.activeNode = ko.observable(null);
        this.activeImage = ko.observable(null);
        this.activeScript = ko.observable(null);
        this.references = {
            images: ko.computed(this._referencedImages, this)
        };

        this._prompt_openAction = ko.observable();
        this._confirm_openAction = ko.observable();
        this._fileBrowser_openAction = ko.observable();
        this._window_openAction = ko.observable();
        this._window_closeAction = ko.observable();
        this._drive_disconnectAction = ko.observable();
        this._drive_uploadFileAction = ko.observable();
        this._markdownEditor_insertAction = ko.observable();
        this._markdownEditor_selectAction = ko.observable();

        tooltip();
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Vyberie uzol v dokumente.
     * 
     * @param {object} node Uzol v dokumente.
     */    
    Model.prototype._selectNode = function (node) {
        var n = this.activeNode();
        if (n) {
            n.isActive(false);
        }

        if (node) {
            node.isActive(true);
        }
        
        this.title(node ? node.title() : "");
        this.activeNode(node);
        this.editor(node ? "markdown" : "");
    };
    

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
                title: title,
                isInToc: true
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
     * @param {object} node Položka.
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
     * Nastaví flag pre node.
     * 
     * @param {object} node Uzol, pre ktorý treba nstaviť flag.
     * @param {string} flag Názov vlastnosti, ktorá sa má nastaviť.
     */
    Model.prototype._flagNode = function(node, flag) {
        var value = node[flag]();
        node[flag](!value);
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
     * Vyberie obrázok.
     * 
     * @param {object} image Obrázok.
     */    
    Model.prototype._selectImage = function (image) {
        var n = this.activeImage();
        if (n) {
            n.isActive(false);
        }

        if (image) {
            image.isActive(true);
        }
        
        this.title(image ? "Obrázky" : "");
        this.activeImage(image);
        this.editor(image ? "image" : "");
    };


    /**
     * Vymaže obrázok.
     * 
     * @param {object} image Obrázok, ktorý sa má vymazať.
     */
    Model.prototype._deleteImage = function (image) {
        this.images.remove(image);
        return image;
    };
    

    /**
     * Prid obrázok.
     * 
     * @param {object} title Názov obrázku.
     * @param {object} blob Obrázok.
     */
    Model.prototype._addImage = function (title, blob) {
        var img = new Resource({
            title: title,
            url: global.URL.createObjectURL(blob)
        });
        this.images.unshift(img);
        return img;
    };
    

    /**
     * Vyberie skript v dokumente.
     * 
     * @param {object} script Skript v dokumente.
     */    
    Model.prototype._selectScript = function (script) {
        var n = this.activeScript();
        if (n) {
            n.isActive(false);
        }

        if (script) {
            script.isActive(true);
        }
        
        this.title(script ? script.title() : "Skripty");
        this.activeScript(script);
        this.editor(script ? "script" : "scripts");
    };
    

    /**
     * Vymaže skript.
     * 
     * @param {object} script Skript, ktorý sa má vymazať.
     */
    Model.prototype._deleteScript = function (script) {
        this.scripts.remove(script);
        return script;
    };


    /**
     * Pridá skript.
     * 
     * @param {object} title Názov skript.
     * @param {object} blob Skript.
     */
    Model.prototype._addScript = function (title, blob) {
        var script = new Resource({
            title: title,
            url: global.URL.createObjectURL(blob)
        });
        this.scripts.unshift(script);
        return script;
    };
        

    /**
     * Otvorí súbor/projekt.
     * 
     * @param {string} fileName Názov súboru.
     * @param {string} template HTML šablóna pre výstup.
     * @param {object} meta Metainformácie.
     * @param {array} nodes Uzly dokumentu.
     * @param {array} images Obrázky dokumentu.
     * @param {array} scripts Skripty dokumentu.
     */
    Model.prototype._open = function(fileName, template, meta, nodes, images, scripts) {
        this.tool("explorer");
        this.editor("");
        this.title("");

        this.fileName(fileName);
        this.template(template);
        this.meta(this._parseMeta(meta));
        this.nodes(this._parseNodes(nodes, null));
        this.images(this._parseImages(images));
        this.scripts(this._parseScripts(scripts));
    };


    /**
     * Nájde aktívny uzol v dokumente.
     * 
     * @param {array} nodes Zoznam položiek v dokumente.
     */
    Model.prototype._findActiveNode = function(nodes) {
        var buffer = nodes;
        if(!(buffer instanceof Array)) {
            buffer = [buffer];    
        }
        
        var active = null;
        for(var i = 0; i < buffer.length; i++) {
            var n = buffer[i];

            if(n.isActive()) {
                return n;
            }

            if(n.nodes().length) {
                active = this._findActiveNode(n.nodes());
            }

            if(active) {
                return active;
            }
        }

        return active;
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
                isActive: n.isActive,
                isInToc: n.isInToc
            });
            tmp.nodes($this._parseNodes(n.nodes, tmp));
            return tmp;
        });
    };


    /**
     * Spracovanie obrázkov dokumentu.
     * 
     * @param {array} images Obrázky dokumentu.
     */
    Model.prototype._parseImages = function(images) {
        if ((typeof(images) === "undefined") || !(images instanceof Array)) {
            return [];
        }
        
        return images.map(function(i) {
            var tmp = new Resource({
                title: i.title.replace("images/",""),
                url: global.URL.createObjectURL(i.blob)
            });
            return tmp;
        });
    };


    /**
     * Spracovanie skriptov dokumentu.
     * 
     * @param {array} scripts Skripty dokumentu.
     */
    Model.prototype._parseScripts = function(scripts) {
        if ((typeof(scripts) === "undefined") || !(scripts instanceof Array)) {
            return [];
        }
        
        return scripts.map(function(s) {
            var tmp = new Resource({
                title: s.title.replace("scripts/",""),
                url: global.URL.createObjectURL(s.blob)
            });
            return tmp;
        });
    };    
    

    /**
     * Zoznam referencovaných obrázkov.
     */
    Model.prototype._referencedImages = function() {
        var node = this.activeNode();
        if(!node) {
            return [];
        }

        var references = Node.getReferencedImages(node.content());
        var images = this.images();

        return images.filter(function(i) {
            return references.indexOf(i.search()) !== -1;
        });
    };


    /**
     * Zruší obnovovanie náhľadu.
     */
    Model.prototype._cancelPreview = function() {
        if(previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }
    };


    /**
     * Obnoví náhľad výstupu.
     */
    Model.prototype._refreshPreview = function() {
        if(!previewWindow || (previewWindow && previewWindow.closed)) {
            this._cancelPreview();
            previewWindow = null;
            return;
        }

        var $this = this;

        this.toHtml()
            .then(function(result) {
                $this._cancelPreview();

                // Odpamatame scroll poziciu
                var top = (previewWindow.pageYOffset || previewWindow.document.scrollTop)  - (previewWindow.document.clientTop || 0);

                previewWindow.document.open();
                previewWindow.document.write(result);
                previewWindow.document.close();

                // Nascrolujeme na povodnu pozicu
                previewWindow.scrollTo(0, top);

                previewTimeout = setTimeout($this._refreshPreview.bind($this), previewDuration);
            })
            .catch(function(error) {
                $this._cancelPreview();

                console.error("App : _refreshPreview() : " + error);

                previewTimeout = setTimeout($this._refreshPreview.bind($this), previewDuration);
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
     * Vyberie uzol v dokumente.
     * 
     * @param {object} node Uzol v dokumente.
     */    
    Model.prototype.selectNode = function (node) {
        this._selectImage(null);
        this._selectScript(null);
        this._selectNode(node);
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
     * Nastaví flag pre node.
     * 
     * @param {object} node Uzol, pre ktorý treba nstaviť flag.
     * @param {string} flag Názov vlastnosti, ktorá sa má nastaviť.
     */
    Model.prototype.flagNode = function(node, flag) {
        this._flagNode(node, flag);
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
     * Vyberie obrázok.
     * 
     * @param {object} image Obrázok.
     */    
    Model.prototype.selectImage = function (image) {
        this._selectNode(null);
        this._selectScript(null);
        this._selectImage(image);
    };


    /**
     * Premenuje obrázok.
     * 
     * @param {object} image Obrázok ktorý sa má premenovať.
     */
    Model.prototype.renameImage = function(image) {
        var $this = this;
        return this.prompt("Premenovať obrázok", "Zadajte nový názov pre obrázok <b>" + image.title() + "</b>", image.title(), "Premenovať", "Zrušiť")
            .then(function(title) {
                if(title === null) {
                    return null;
                }

                if(!title) {
                    return $this.confirm("Premenovať obrázok", "Musíte zadať názov.", "Ok").then(function() {
                        return $this.renameImage(image);
                    });
                }
                
                return $this._renameNode(title, image);
            });        
    };    
    

    /**
     * Vymaže obrázok.
     * 
     * @param {object} image Obrázok, ktorý sa má vymazať.
     */
    Model.prototype.deleteImage = function(image) {
        var $this = this;
        return this.confirm("Vymazať obrázok", "Chcete vymazať obrázok <b>" + image.title() + "</b>?", "Vymazať", "Zrušiť")
            .then(function(r) {
                if(!r) {
                    return;
                }
                
                return $this._deleteImage(image);
            });
    };
    

    /**
     * Pridá obrázok.
     */
    Model.prototype.addImage = function() {
        var $this = this;

        return this.browse("Nový obrázok", "Názov obrázku", "arrayBuffer", null, true, "Pridať", "Zrušiť")
            .then(function(data) {
                // Ak prislo null pouzivatel zrusil okno
                if(!data) {
                    return Promise.reject(null);
                }
                
                // Ak prislo prazdne pole pouzivatel nevybral ziaden subor
                if (!data.length) {
                    throw "Musíte vybrať obrázok.";
                }

                // Pridame obrazky do kolekcie
                var image;
                for(var i = 0; i < data.length; i++) {
                    var tmp = data[i];
                    image = $this._addImage(tmp.name, new Blob([tmp.content]));
                }
                
                return image;
            })
            .catch(function(error) {
                if(!error) {
                    return;
                }
                console.error("App : addImage() : " + error);
                $this.confirm("Nový obrázok", (typeof(error) === "string") ? error : "Nepodarilo sa otvoriť obrázok.", "Ok");
            });
    };   


    /**
     * Zobrazí obrázok v plnej veľkosti.
     * 
     * @param {object} image Obrázok, ktorý sa má zobraziť.
     */
    Model.prototype.fullscreeImage = function(image) {
        global.open(image.url(), image.title());
    };    


    /**
     * Vloží obrázok do textu.
     * 
     * @param {object} image Obrázok, ktorý sa má vložiť.
     */
    Model.prototype.insertImage = function(image) {
        var title = image.title();
        var id = image.search();

        this.insertMarkdown("![" + title + "][" + id + "]");
    };


    /**
     * Vloží markdown do textu.
     * 
     * @param {string} markdown Markdown text.
     */
    Model.prototype.insertMarkdown = function(markdown) {
        var action = this._markdownEditor_insertAction();

        if ((typeof (action) !== "function")
            || (this.editor() !== "markdown")) {
            return;
        }

        return action(markdown || "");
    };


    /**
     * Vyselektuje text v dokumentu.
     * 
     * @param {object} from Začiatok selekcie.
     * @param {object} to Koniec selekcie.
     */
    Model.prototype.selectMarkdown = function(from, to) {
        var action = this._markdownEditor_selectAction();

        if ((typeof (action) !== "function")
            || (this.editor() !== "markdown")) {
            return;
        }

        action(from, to);
    };    


    /**
     * Vyberie skript v dokumente.
     * 
     * @param {object} script Skript v dokumente.
     */    
    Model.prototype.selectScript = function (script) {
        this._selectImage(null);
        this._selectNode(null);
        this._selectScript(script);
    };
        

    /**
     * Premenuje skript.
     * 
     * @param {object} script Skript, ktorý sa má premenovať.
     */
    Model.prototype.renameScript = function(script) {
        var $this = this;
        return this.prompt("Premenovať skript", "Zadajte nový názov pre skript <b>" + script.title() + "</b>", script.title(), "Premenovať", "Zrušiť")
            .then(function(title) {
                if(title === null) {
                    return null;
                }

                if(!title) {
                    return $this.confirm("Premenovať skript", "Musíte zadať názov.", "Ok").then(function() {
                        return $this.renameScript(script);
                    });
                }
                
                return $this._renameNode(title, script);
            });        
    };    
    
    
    /**
     * Vymaže skript.
     * 
     * @param {object} script Skript, ktorý sa má vymazať.
     */
    Model.prototype.deleteScript = function(script) {
        var $this = this;
        return this.confirm("Vymazať skript", "Chcete vymazať skript <b>" + script.title() + "</b>?", "Vymazať", "Zrušiť")
            .then(function(r) {
                if(!r) {
                    return;
                }
                
                return $this._deleteScript(script);
            });
    };
    

    /**
     * Pridá skript.
     */
    Model.prototype.addScript = function() {
        var $this = this;

        return this.browse("Nový skript", "Názov skriptu", "arrayBuffer", "*.js", true, "Pridať", "Zrušiť")
            .then(function(data) {
                // Ak prislo null pouzivatel zrusil okno
                if(!data) {
                    return Promise.reject(null);
                }
                
                // Ak prislo prazdne pole pouzivatel nevybral ziaden subor
                if (!data.length) {
                    throw "Musíte vybrať skript.";
                }

                // Pridame skripty do kolekcie
                var script;
                for(var i = 0; i < data.length; i++) {
                    var tmp = data[i];
                    script = $this._addScript(tmp.name, new Blob([tmp.content]));
                }
                
                return script;
            })
            .catch(function(error) {
                if(!error) {
                    return;
                }
                console.error("App : addScript() : " + error);
                $this.confirm("Nový skript", (typeof(error) === "string") ? error : "Nepodarilo sa otvoriť skript.", "Ok");
            });
    };   
         

    /**
     * Vyvolá dialóg pre vytvorenie nového súboru.
     */
    Model.prototype.newProject = function () {
        var $this = this;
        var name;
        var url;
        var archive;
        var template = null;
        var meta = null;
        var nodes = null;
        var images = null;
        var scripts = null;        

        var w = this.window("new-project");
        w.open()
            .then(function(r) {
                if(!r) {
                    return Promise.reject(null);
                }

                if(!r.filename) {
                    throw "Musíte zadať názov pre nový projekt.";
                }
                name = r.filename;
                if(!name.endsWith(".mdzip")) {
                    name = name + ".mdzip";
                }

                if(!r.url) {
                    throw "Musíte vybrať šablónu.";
                }
                url = r.url;

                // V IIS nastavit mime type pre ".mdzip" application/x-zip-compressed
                return fetch(require.toUrl(url), {cache: "no-store"})
                    .then(function(r) {
                        return r.blob();
                    });
            })
            .then(function(blob) {
                return new zip().loadAsync(blob);
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

                // Nacitame obrazky
                var files = [];
                archive.folder("images").forEach(function (relativePath, file) {
                    files.push(file.async("blob").then(function(blob) {
                        return {
                            title: file.name,
                            blob: blob
                        };
                    }));
                });
                return Promise.all(files);
            })
            .then(function (r) {
                images = r;

                // Nacitame skripty
                var files = [];
                archive.folder("scripts").forEach(function (relativePath, file) {
                    files.push(file.async("blob").then(function(blob) {
                        return {
                            title: file.name,
                            blob: blob
                        };
                    }));
                });
                return Promise.all(files);                
            })
            .then(function (r) {
                scripts = r;
            })
            .then(function() {
                $this._open(name, template, meta, nodes, images, scripts);
                var an = $this._findActiveNode($this.nodes());
                if(an) {
                    $this._selectNode(an);
                }
            })            
            .catch(function(error) {
                if(!error) {
                    return;
                }
                console.error("App : newProject() : " + error);
                $this.confirm("Nový projekt", (typeof(error) === "string") ? error : "Nepodarilo sa vytvoriť nový projekt.", "Ok");
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
        var images = null;
        var scripts = null;

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

                // Nacitame obrazky
                var files = [];
                archive.folder("images").forEach(function (relativePath, file) {
                    files.push(file.async("blob").then(function(blob) {
                        return {
                            title: file.name,
                            blob: blob
                        };
                    }));
                });
                return Promise.all(files);
            })
            .then(function (r) {
                images = r;

                // Nacitame skripty
                var files = [];
                archive.folder("scripts").forEach(function (relativePath, file) {
                    files.push(file.async("blob").then(function(blob) {
                        return {
                            title: file.name,
                            blob: blob
                        };
                    }));
                });
                return Promise.all(files);                
            })
            .then(function (r) {
                scripts = r;
            })
            .then(function() {
                $this._open(name, template, meta, nodes, images, scripts);
                var an = $this._findActiveNode($this.nodes());
                if(an) {
                    $this._selectNode(an);
                }
            })
            .catch(function(error) {
                if(!error) {
                    return;
                }
                console.error("App : open() : " + error);
                $this.confirm("Otvoriť projekt", (typeof(error) === "string") ? error : "Nepodarilo sa načítať obsah súboru.", "Ok");
            });
    };


    /**
     * Otvorí a načíta dokument zo vstupného blob-u.
     * 
     * @param {string} fileName Názov súboru.
     * @param {Blob} blob Blob reprezentujúci súbor.
     */
    Model.prototype.openBlob = function (fileName, blob) {
        var $this = this;

        var name = fileName;
        var archive = null;
        var template = null;
        var meta = null;
        var nodes = null;
        var images = null;
        var scripts = null;

        // Pokusime sa rozbalit zip
        new zip()
            .loadAsync(blob)
            .then(function (a) {
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

                // Nacitame obrazky
                var files = [];
                archive.folder("images").forEach(function (relativePath, file) {
                    files.push(file.async("blob").then(function(blob) {
                        return {
                            title: file.name,
                            blob: blob
                        };
                    }));
                });
                return Promise.all(files);
            })
            .then(function (r) {
                images = r;

                // Nacitame skripty
                var files = [];
                archive.folder("scripts").forEach(function (relativePath, file) {
                    files.push(file.async("blob").then(function(blob) {
                        return {
                            title: file.name,
                            blob: blob
                        };
                    }));
                });
                return Promise.all(files);                
            })
            .then(function (r) {
                scripts = r;
            })
            .then(function() {
                $this._open(name, template, meta, nodes, images, scripts);
                var an = $this._findActiveNode($this.nodes());
                if(an) {
                    $this._selectNode(an);
                }
                $this.loading(false);
            })            
            .catch(function(error) {
                $this.loading(false);

                if(!error) {
                    return;
                }
                console.error("App : openBlob() : " + error);
                $this.confirm("Otvoriť projekt", (typeof(error) === "string") ? error : "Nepodarilo sa načítať obsah súboru.", "Ok");
            });            
    };    


    /**
     * Zobrazí náhľad výstupu.
     */
    Model.prototype.preview = function() {
        if(previewWindow) {
            this._cancelPreview();
            previewWindow.close();
            previewWindow = null;
            return;
        }
        
        // Otvorime okno s nahladom
        previewWindow = global.open("blank.html", this.fileName(), "titlebar=yes");
        
        // Vytvorime prvy nahlad
        var $this = this;
        this.loading(true, "Náhľad výstupu");
        this.toHtml()
            .then(function (result) {
                $this.loading(false);

                // Zapiseme vystup do preview okna
                previewWindow.document.open();
                previewWindow.document.write(result);
                previewWindow.document.close();

                // Nahlad sa bude obnovovat kazdych 5 sekund
                previewTimeout = setTimeout($this._refreshPreview.bind($this), previewDuration);
            })
            .catch(function(error) {
                $this.loading(false);
                console.error("App : preview() : " + error);
                $this.confirm("Náhľad výstupu", "Nepodarilo sa vytvoriť náhľad výstupu.", "Ok");
            });
    };


    /**
     * Uloží projekt.
     * 
     * @param {boolean} toDisc Ak je nastavené na true súbor sa ukladá na disk.
     */
    Model.prototype.save = function(toDisc) {
        toDisc = (typeof(toDisc) === "boolean") ? toDisc : true;

        var fileName;
        var scripts;
        var images;
        var archive;

        return this.toJson()
            .then(function (json) {
                // Odlozime si nazov suboru
                fileName = json.fileName;
                images = json.images;
                scripts = json.scripts;

                // Vytvorime zip subor
                archive = new zip();
                
                // Pridame obsah do archivu
                archive.file("template.html", json.template);
                archive.file("meta.json", JSON.stringify(json.meta, null, 4));
                archive.file("nodes.json", JSON.stringify(json.nodes, null, 4));

                // Ak nie su obrazky ulozime subor
                if(!images.length) {
                    return [];
                }

                // Spracovanie obrazkov
                return Promise.all(images.map(function(img) {
                    return fetch(img.url)
                        .then(function(r) {
                            return r.blob();
                        })
                        .then(function (r) {
                            return {
                                title: img.title,
                                blob: r
                            };
                        });
                }));
            })
            .then(function (images) {
                if(images.length) {
                    // Vytvorime priecinok pre obrazky
                    var folder = archive.folder("images");
    
                    // Pridame do neho vsetky obrazky
                    images.forEach(function(img) {
                        folder.file(img.title, img.blob);
                    });
                }

                // Ak nie su skripty ulozime subor
                if(!scripts.length) {
                    return [];
                }

                // Spracovanie obrazkov
                return Promise.all(scripts.map(function(s) {
                    return fetch(s.url)
                        .then(function(r) {
                            return r.blob();
                        })
                        .then(function (r) {
                            return {
                                title: s.title,
                                blob: r
                            };
                        });
                }));
            })
            .then(function(scripts) {
                if(scripts.length) {
                    // Vytvorime priecinok pre skripty
                    var folder = archive.folder("scripts");
    
                    // Pridame do neho vsetky skripty
                    scripts.forEach(function(s) {
                        folder.file(s.title, s.blob);
                    });
                }
            })
            .then(function() {
                return archive.generateAsync({ type: "blob" });
            }) 
            .then(function(content) {
                // Ponukneme na stiahnutie
                if(toDisc) {
                    saveAs(content, fileName);
                }
                else {
                    return {
                        fileName: fileName,
                        content: content
                    };
                }
            })
            .catch(function(error) {
                console.error("App : save() : " + error);
                $this.confirm("Uloženie projektu", "Nepodarilo sa uložiť projekt.", "Ok");
            });        
    };


    /**
     * Uloží súbor do cloudu.
     */
    Model.prototype.saveCloud = function() {
        var action = this._drive_uploadFileAction();

        if (typeof (action) !== "function") {
            console.error("App : saveCloud() : Akcia pre nahratie súboru nie je definovaná.");
            return;
        }

        this.save(false)
            .then(function(r) {
                return action(r.fileName, r.content);
            })
            .catch(function(error) {
                console.error("App : saveCloud() : " + error);
                $this.confirm("Uloženie projektu", "Nepodarilo sa uložiť projekt.", "Ok");
            });
    };


    /**
     * Uloží výstup projekt.
     */
    Model.prototype.download = function() {
        var $this = this;
        var fileName = this.fileName().replace(".mdzip",".html");

        this.loading(true, "Stiahutie výstupu");
        this.toHtml()
            .then(function (html) {
                return new Blob([html], { type: "text/html;charset=utf-8" });
            })
            .then(function(content) {
                $this.loading(false);
                saveAs(content, fileName);
            })
            .catch(function(error) {
                $this.loading(false);
                console.error("App : download() : " + error);
                $this.confirm("Stiahutie výstupu", "Nepodarilo sa vytvoriť výstupu.", "Ok");
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
     * Vygeneruje JSON reprezentáciu dokumentu.
     */
    Model.prototype.toJson = function() {
        var $this = this;
        return new Promise(function(resolve) {
            var o = {
                fileName: $this.fileName(),
                template: $this.template(),
                meta: {},
                scripts: [],
                nodes: [],
                images: []
            };

            $this.meta().forEach(function(m) {
                o.meta[m.key] = {
                    label: m.label,
	                value: m.value()
                };
            });

            o.scripts = $this.scripts().map(function(i) {
                return i.toJson();
            });

            o.nodes = $this.nodes().map(function(n) {
                return n.toJson();
            });

            o.images = $this.images().map(function(i) {
                return i.toJson();
            });

            resolve(o);
        });   
    };    
    

    /**
     * Vygeneruje html výstup.
     */
    Model.prototype.toHtml = function() {
        var $this = this;

        return new Promise(function(resolve, reject) {
            // Kontrola ci je mozne vobec spustit generovanie html
            var template = $this.template();
            if(!template) {
                reject("Nie je možné vytvoriť HTML bez šablóny.");
            }

            // Ziskame JSON reprezentaciu celeho dokumentu
            $this.toJson().then(function(json) {
                // Vytvorime worker
                var worker = new Worker(require.toUrl("dp/workers/toHtml.js"));

                // Spracovanie udalosti
                worker.onmessage = function(e) {
                    resolve(e.data);
                    worker = null;
                };
                worker.onerror = function(e) {
                    reject("Worker error at line " + e.lineno + " in '" + e.filename + "' : " + e.message);
                    worker = null;
                };
                
                // Spustime worker
                worker.postMessage(json);
                // TODO : MOZNOST ZRUSIT BEZICI WORKER CEZ LOADING MODAL
                //myWorker.terminate();
            });
        });   
    };

    
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~App()");

        this.references.images.dispose();
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