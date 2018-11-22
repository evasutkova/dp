//#region [ Imports ]

importScripts("../polyfills/string.js");
importScripts("../libs/mustache.js");
importScripts("../libs/highlight.js");
importScripts("../libs/showdown.js");
importScripts("../libs/showdown.footnotes.js");
importScripts("../libs/showdown.highlight.js");
importScripts("../libs/showdown.nomnoml.js");
importScripts("../libs/showdown.jsfiddle.js");
importScripts("../document/node.js");

//#endregion


//#region [ Fields ]

var data;
var view;
var converter;

//#endregion


//#region [ Main ]

/**
 * Spracovanie udalostí z hlavného vlákna.
 * 
 * @param {object} e Parametre.
 */
self.onmessage = function(e) {
    // Odlozime si data
    data = e.data;

    start()
        .then(metadata)
        .then(toc)
        .then(articles)
        .then(pages)
        .then(scripts)
        .then(tot)
        .then(toi)
        .then(tos)
        .then(finish)
        .catch(function(error) {
            self.postMessage(JSON.stringify({error: error}));
            self.close(); 
        });
};

//#endregion


//#region [ Methods : Private ]

/**
 * Spracovanie uzlov pre TOC.
 * 
 * @param {string} parentId Identifikátor nadradeného uzla.
 * @param {object} node Aktuálne spracovávaný uzol.
 */
function _toc(parentId, node) {
    if(!node.isInToc) {
        return Promise.resolve(null);
    }

    // Toc view pre aktualny uzol
    var ti = {
        id: (parentId ? parentId + "_" : "") + node.title.toCodeName(),
        title: node.title,
        keywords: node.keywords,
        hasChildren: false
    };

    var nodes = node.nodes;
    if(!(nodes instanceof Array) || !nodes.length) {
        return Promise.resolve(ti);
    }

    ti.hasChildren = true;
    ti.children = [];

    var tasks = nodes.map(function(n) {
        return _toc(ti.id, n);
    });

    return Promise.all(tasks).then(function(items) {
        ti.children = items.filter(function(i) {
            return i !== null;
        });

        return ti;
    });
}


/**
 * Spracovanie uzlov pre TOT.
 * 
 * @param {object} node Aktuálne spracovávaný uzol.
 */
function _tot(node) {
    var regex = /<\/table>\s+<h6\sid="([^<>]+)">([^<>]+)<\/h6>/g;
    var content = node.content;
    var list = [];
    var match;
    while((match = regex.exec(content)) !== null) {
        list.push({
            id: match[1] || "",
            title: match[2] || ""
        });
    }

    var nodes = node.sections;
    if(!(nodes instanceof Array) || !nodes.length) {
        return Promise.resolve(list);
    }

    var tasks = nodes.map(function(n) {
        return _tot(n);
    });

    return Promise.all(tasks).then(function(items) {
        return list.concat.apply([], items);
    });    
}


/**
 * Spracovanie uzlov pre TOI.
 * 
 * @param {object} node Aktuálne spracovávaný uzol.
 */
function _toi(node) {
    var regex = /<\/p>\s+<h6\sid="([^<>]+)">([^<>]+)<\/h6>/g;
    var regexNomnoml = /<div\sclass='nomnoml-source'>[^<>]+<\/div>\s+<h6\sid="([^<>]+)">([^<>]+)<\/h6>/g;
    var content = node.content;
    var list = [];
    var match;
    while((match = regex.exec(content)) !== null) {
        list.push({
            id: match[1] || "",
            title: match[2] || ""
        });
    }
    while((match = regexNomnoml.exec(content)) !== null) {
        list.push({
            id: match[1] || "",
            title: match[2] || ""
        });
    }

    var nodes = node.sections;
    if(!(nodes instanceof Array) || !nodes.length) {
        return Promise.resolve(list);
    }

    var tasks = nodes.map(function(n) {
        return _toi(n);
    });

    return Promise.all(tasks).then(function(items) {
        return list.concat.apply([], items);
    });    
}


/**
 * Spracovanie uzlov pre TOT.
 * 
 * @param {object} node Aktuálne spracovávaný uzol.
 */
function _tos(node) {
    var regex = /<\/pre>\s+<h6\sid="([^<>]+)">([^<>]+)<\/h6>/g;
    var content = node.content;
    var list = [];
    var match;
    while((match = regex.exec(content)) !== null) {
        list.push({
            id: match[1] || "",
            title: match[2] || ""
        });
    }

    var nodes = node.sections;
    if(!(nodes instanceof Array) || !nodes.length) {
        return Promise.resolve(list);
    }

    var tasks = nodes.map(function(n) {
        return _tos(n);
    });

    return Promise.all(tasks).then(function(items) {
        return list.concat.apply([], items);
    });    
}


/**
 * Spracovanie uzlov v dokumente.
 * 
 * @param {string} parentId Identifikátor nadradeného uzla.
 * @param {object} node Aktuálne spracovávaný uzol.
 * @param {boolean} isInToc Ak je true, spracuje sa iba uzol, ktorý je v TOC.
 */
function _content(parentId, node, isInToc) {
    if((isInToc && !node.isInToc) || (!isInToc && node.isInToc)) {
        return Promise.resolve(null);
    }

    // Section view pre aktualny uzol
    var section = {
        id: (parentId ? parentId + "_" : "") + node.title.toCodeName(),
        title: node.title,
        content: node.content,
        hasSections: false
    };

    var nodes = node.nodes;
    if(!(nodes instanceof Array) || !nodes.length) {
        return _images(section.content).then(function(images) {
            section.content = converter.makeHtml(section.content + images);
            return section;
        });
    }

    section.hasSections = true;
    section.sections = [];

    var tasks = nodes.map(function(n) {
        return _content(section.id, n, isInToc);
    });

    return Promise.all(tasks).then(function(items) {
        section.sections = items.filter(function(i) {
            return i !== null;
        });

        var imageTasks = section.sections.map(function(s) {
            return _images(section.content).then(function(images) {
                section.content = converter.makeHtml(section.content + images);
                return section;
            });
        });

        return Promise.all(imageTasks).then(function() {
            return section;
        });
    });    
}


/**
 * Zistí všetky referencie na obrázky vo vstupnom obsahu položky dokumentu a vráti 
 * markdown pre dané obrázky.
 * 
 * @param {string} content Obsah položky v dokumente.
 */
function _images(content) {
    var images = data.images;

    // Ak nie su ziadne obrazky rovno koncime
    if(!images.length) {
        return Promise.resolve("");
    }

    // Zistime referencie v dokumente, ak nie su koncime
    var references = Dp.Node.getReferencedImages(content);
    if(!references.length) {
        return Promise.resolve("");
    }

    // Stiahnutie obrazkov a ich konverzia na base64 url
    var tasks = images
        .filter(function(i) {
            return references.indexOf(i.search) !== -1;
        })
        .map(function(i) {
            return fetch(i.url)
                .then(function(r) {
                    return r.blob();
                })
                .then(function(blob) {
                    return new Promise(function(resolve) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            resolve('[' + i.search + ']: ' + reader.result + ' "' + i.title + '"');
                        };
                        reader.readAsDataURL(blob);
                    });
                });
        });

    return Promise.all(tasks).then(function() {
        var result = Array.prototype.slice.call(arguments);
        return "\n" + result.join("\n");
    });
}

//#endregion


//#region [ Methods ]

/**
 * Inicializácia view pre mustache. 
 */
function start() {
    view = {
        fileName: data.fileName,
        meta: {},
        scripts: {},
        toc: [],
        tot: [],
        toi: [],
        tos: [],
        articles: []
    };

    converter = new showdown.Converter({
        tables: true, 
        tasklists: true,
        strikethrough: true,
        openLinksInNewWindow: true,
        highlightAuto: false,
        extensions: ["footnotes", "nomnoml", "jsfiddle", "highlight"]
    });         

    return Promise.resolve(view);
}


/**
 * Ukončenie práce a zaslanie výsledkov. 
 */
function finish() {
    //self.postMessage(JSON.stringify(view));
    self.postMessage(Mustache.render(data.template, view));
    self.close(); 
}


/**
 * Spracovanie metaúdajov.
 */
function metadata() {
    var meta = data.meta;

    return new Promise(function(resolve) {
        Object
        .keys(meta)
        .forEach(function(key) {
            view.meta[key] = meta[key].value;
        });

        resolve(view.meta);
    });
}


/**
 * Spracovanie TOC - Obsah.
 */
function toc() {
    var nodes = data.nodes;

    var tasks = nodes.map(function(n) {
        return _toc("", n);
    });
    
    return Promise.all(tasks).then(function(items) {
        view.toc = items.filter(function(i) {
            return i !== null;
        });

        return view.toc;
    });        
}


/**
 * Spracovanie TOT - Zoznam tabuliek.
 */
function tot() {
    var nodes = view.articles;

    var tasks = nodes.map(function(n) {
        return _tot(n);
    });

    return Promise.all(tasks).then(function(items) {
        view.tot = [].concat.apply([], items);
        return view.tot;
    });    
}


/**
 * Spracovanie TOI - Zoznam obrázkov.
 */
function toi() {
    var nodes = view.articles;

    var tasks = nodes.map(function(n) {
        return _toi(n);
    });

    return Promise.all(tasks).then(function(items) {
        view.toi = [].concat.apply([], items);
        return view.toi;
    });    
}


/**
 * Spracovanie TOS - Zoznam skriptov.
 */
function tos() {
    var nodes = view.articles;

    var tasks = nodes.map(function(n) {
        return _tos(n);
    });

    return Promise.all(tasks).then(function(items) {
        view.tos = [].concat.apply([], items);
        return view.tos;
    });    
}


/**
 * Spracovanie hlavného obsahu.
 */
function articles() {
    var nodes = data.nodes;

    var tasks = nodes.map(function(n) {
        return _content("", n, true);
    });
    
    return Promise.all(tasks).then(function(items) {
        view.articles = items.filter(function(i) {
            return i !== null;
        });

        return view.articles;
    }); 
}


/**
 * Spracovanie stránok, to sú tie article, ktoré sú označené aby neboli v TOC.
 */
function pages() {
    var nodes = data.nodes;

    var tasks = nodes.map(function(n) {
        return _content("", n, false);
    });
    
    return Promise.all(tasks).then(function(items) {
        var pages = items.filter(function(i) {
            return i !== null;
        });

        pages.forEach(function(p) {
            view["@" + p.id] = p;
        });

        return pages;
    }); 
}


/**
 * Spracovanie skriptov.
 */
function scripts() {
    var scripts = data.scripts;

    // Ak nie su ziadne skripty rovno koncime
    if(!scripts.length) {
        return Promise.resolve(null);
    }

    // Stiahnutie skriptov a ich konverzia na text
    var tasks = scripts.map(function(i) {
        return fetch(i.url)
            .then(function(r) {
                return r.text();
            })
            .then(function(content) {
                return {
                    name: i.search,
                    content: content
                };
            });
    });

    return Promise.all(tasks).then(function(items) {
        items.forEach(function(i) {
            view.scripts[i.name] = i.content;
        });
        return items;
    });
}

//#endregion