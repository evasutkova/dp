(function () {
    //#region [ Fields ]

    var global = (function() { return this; })();
    var storage = global.sessionStorage;

    //#endregion


    //#region [ Methods ]

    /**
     * Uloží vstupný objekt do sessionStorage.
     * 
     * @param {string} module Identifikátor modulu.
     * @param {object} value Objekt, ktorý sa má uložiť.
     */
    function set(module, value) {
        if(!value) {
            storage.removeItem(module);
            return;
        }
        
        storage.setItem(module, JSON.stringify(value));
    }


    /**
     * Načíta hodnotu pre objekt zo session storage.
     * 
     * @param {string} module Identifikátor modulu.
     * @param {string} key Identifikátor vlastnosti, ktorá sa má načítať.
     */
    function get(module, key) {
        var data = JSON.parse(sessionStorage.getItem(module)) || {};
        return data[key];
    }

    //#endregion


    //#region [ Module ]

    define({
        load: function (name, req, load, config) {
            var component = req.toUrl(".").split("?")[0].split("js/");
            component = component[component.length - 1];
    
            load({
                set: set.bind(storage, component),
                get: get.bind(storage, component)
            });
        }
    });

    //#endregion
}());