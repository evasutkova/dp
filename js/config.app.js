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