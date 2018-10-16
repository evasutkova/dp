require({
    urlArgs: "t=v1.0.0",
    packages: [{
        name: "dp",
        location: "/dp/wwwroot/js"
    }],
    paths: {
        jquery: "/dp/wwwroot/js/libs/jquery",
        ajaxTransport: "/dp/wwwroot/js/libs/jquery.ajaxTransport",
        knockout: "/dp/wwwroot/js/libs/knockout",
        materialize: "/dp/wwwroot/js/libs/materialize",
        text: "/dp/wwwroot/js/libs/text",
        google: "/dp/wwwroot/js/libs/google"
    },
    config: {
        "dp/components/app/app": {
        }
    }
}, ["dp/main"]);