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
        google: "/dp/wwwroot/js/libs/google",
        optiscroll: "/dp/wwwroot/js/libs/optiscroll",
        session: "/dp/wwwroot/js/storage/session",
        jszip: "/dp/wwwroot/js/libs/jszip",
        codemirror: "/dp/wwwroot/js/libs/codemirror",
        codemirrorCss: "/dp/wwwroot/js/libs/codemirror.css",
        codemirrorHtmlmixed: "/dp/wwwroot/js/libs/codemirror.htmlmixed",
        codemirrorJavascript: "/dp/wwwroot/js/libs/codemirror.javascript",
        codemirrorMarkdown: "/dp/wwwroot/js/libs/codemirror.markdown",
        codemirrorMeta: "/dp/wwwroot/js/libs/codemirror.meta",
        codemirrorXml: "/dp/wwwroot/js/libs/codemirror.xml",        
        codemirrorSimplescrollbars: "/dp/wwwroot/js/libs/codemirror.simplescrollbars",
        showdown: "/dp/wwwroot/js/libs/showdown"
    },
    map: {
        "*": {
            "../lib/codemirror": "codemirror",
            "../../lib/codemirror": "codemirror",
            "../xml/xml": "codemirrorXml",
            "../javascript/javascript": "codemirrorJavascript",
            "../css/css": "codemirrorCss",
            "../meta": "codemirrorMeta"
        }
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