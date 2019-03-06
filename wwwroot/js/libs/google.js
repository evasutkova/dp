define([
    "https://apis.google.com/js/api.js"
], function () {
    //#region [ Fields ]

    var global = (function() { return this; })();
    var gapi = global.gapi;

    //#endregion

    return {
        load: function (name, req, onload, config) {
            //  On load, called to load the auth2 library and API client library
            gapi.load(name, function() {
                onload(gapi);
            });
        }
    };
});