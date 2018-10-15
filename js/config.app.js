require({
    urlArgs: "t=" + (new Date()).getTime(),
    packages: [{
        name: "dp",
        location: "/dp/wwwroot/js"
    }],
    paths: {
        jquery: "/dp/wwwroot/js/libs/jquery",
        ajaxTransport: "/dp/wwwroot/js/libs/jquery.ajaxTransport",
        knockout: "/dp/wwwroot/js/libs/knockout",
        materialize: "/dp/wwwroot/js/libs/materialize",
        text: "/dp/wwwroot/js/libs/text"
    },
    config: {
        "dp/components/app/app": {
        }
    }
}, ["dp/main"]);