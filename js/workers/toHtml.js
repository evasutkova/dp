//#region [ Imports ]

importScripts("../polyfills/string.js");
importScripts("../libs/mustache.js");
importScripts("../libs/showdown.js");

//#endregion


//#region [ Main ]

/**
 * Spracovanie udalostí z hlavného vlákna.
 * 
 * @param {object} e Parametre.
 */
self.onmessage = function(e) {
    // Json data reprezentujuce cely dokument
    var data = e.data;

    // Json pre mustache
    var view = {
        fileName: data.fileName,
        meta: {},
        toc: [],
        sections: []
    };

    // Spracovanie metadat
    getMetadata.bind(view.meta)(data.meta);

    // Vygenerovanie toc
    data.nodes.forEach(getToc.bind(view.toc, ""));

    // Vytvorime converter
    var converter = new showdown.Converter({
        tables: true, 
        tasklists: true,
        strikethrough: true,
        openLinksInNewWindow: true
        //highlightAuto: false,
        //noHeaderId: false,
        //prefixHeaderId: "x",
        //extensions: ["highlight", "materialicons", "panel", "flowchart", "mermaid"]
    }); 

    // Vygenerovanie obsahu
    data.nodes.forEach(getContent.bind(view.sections, "", converter));

    // Vratime vysledok do hlavneho vlakna
    self.postMessage(Mustache.render(data.template, view));

    // Ukoncime worker
    self.close(); 
};

//#endregion


//#region [ Methods ]

/**
 * Spracovanie metaúdajov. 
 * 
 * @param {object} meta Metadáta.
 */
function getMetadata(meta) {
    var keys = Object.keys(meta);
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        this[key] = meta[key].value;
    }
}


/**
 * Spracovanie uzlov a vygenerovanie toc.
 * 
 * @param {string} parentId Identifikátor nadradeného uzla.
 * @param {object} node Aktuálne spracovávaný uzol.
 */
function getToc(parentId, node) {
    // Toc view pre aktualny uzol
    var ti = {
        id: (parentId ? parentId + "-" : "") + node.title.toCodeName(),
        title: node.title,
        keywords: node.keywords,
        hasChildren: false
    };

    // Odlozime aktualny uzol
    this.push(ti);

    // Ak aktualny uzol obsahuje dalsie uzly, spracujeme aj tie
    if((node.nodes instanceof Array) && (node.nodes.length > 0)) {
        ti.hasChildren = true;
        ti.children = [];
        node.nodes.forEach(getToc.bind(ti.children, ti.id));
    }
}


/**
 * Spracovanie uzlov a vygenerovanie obsahue.
 * 
 * @param {string} parentId Identifikátor nadradeného uzla.
 * @param {object} converter Markdown konvertor.
 * @param {object} node Aktuálne spracovávaný uzol.
 */
function getContent(parentId, converter, node) {
    // Section view pre aktualny uzol
    var section = {
        id: (parentId ? parentId + "-" : "") + node.title.toCodeName(),
        title: node.title,
        content: converter.makeHtml(node.content),
        hasChildren: false
    };

    // Odlozime aktualny uzol
    this.push(section);

    // Ak aktualny uzol obsahuje dalsie uzly, spracujeme aj tie
    if((node.nodes instanceof Array) && (node.nodes.length > 0)) {
        section.hasChildren = true;
        section.children = [];
        node.nodes.forEach(getContent.bind(section.children, section.id, converter));
    }
}

//#endregion