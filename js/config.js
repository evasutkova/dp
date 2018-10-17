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
        text: "/wwwroot/js/libs/text",
        google: "/wwwroot/js/libs/google",
        optiscroll: "/wwwroot/js/libs/optiscroll"
    },
    config: {
        "dp/components/tools/drive/drive": {
            apiKey: "AIzaSyDNFM5eXTFSr9V1CkmKlIx_5rlC7_b2xdY",
            clientId: "132615756619-dr6kdei3tegn175epmadh6043r70f60p.apps.googleusercontent.com",
            discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
            ],
            scopes: [
                "https://www.googleapis.com/auth/drive.metadata.readonly",
                "https://www.googleapis.com/auth/drive", 
                "https://www.googleapis.com/auth/drive.file", 
                "https://www.googleapis.com/auth/drive.readonly"
            ]            
        }
    }
}, ["dp/main"]);