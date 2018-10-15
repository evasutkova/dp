require({
    urlArgs: "t=" + (new Date()).getTime(),
    packages: [{
        name: "dp",
        location: "/wwwroot/js"
    }],
    paths: {
        jquery: "/wwwroot/js/libs/jquery",
        ajaxTransport: "/wwwroot/js/libs/jquery.ajaxTransport",
        knockout: "/wwwroot/js/libs/knockout",
        materialize: "/wwwroot/js/libs/materialize",
        text: "/wwwroot/js/libs/text"
    },
    config: {
        "dp/components/app/app": {
        }
    }
}, ["dp/main"]);