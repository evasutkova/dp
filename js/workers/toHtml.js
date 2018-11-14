//#region [ Imports ]

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
    parseMeta.bind(view.meta)(data.meta);

    // Vratime vysledok do hlavneho vlakna
    self.postMessage(JSON.stringify(view));

    // Ukoncime worker
    self.close(); 
};

//#endregion


//#region [ Methods ]

function parseMeta(meta) {
    var keys = Object.keys(meta);
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        this[key] = meta[key].value;
    }
}

//#endregion