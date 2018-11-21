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
        optiscroll: "/wwwroot/js/libs/optiscroll",
        session: "/wwwroot/js/storage/session",
        jszip: "/wwwroot/js/libs/jszip",
        codemirror: "/wwwroot/js/libs/codemirror",
        codemirrorCss: "/wwwroot/js/libs/codemirror.css",
        codemirrorHtmlmixed: "/wwwroot/js/libs/codemirror.htmlmixed",
        codemirrorJavascript: "/wwwroot/js/libs/codemirror.javascript",
        codemirrorMarkdown: "/wwwroot/js/libs/codemirror.markdown",
        codemirrorMeta: "/wwwroot/js/libs/codemirror.meta",
        codemirrorXml: "/wwwroot/js/libs/codemirror.xml",
        codemirrorSimplescrollbars: "/wwwroot/js/libs/codemirror.simplescrollbars",
        showdown: "/wwwroot/js/libs/showdown",
        showdownFootnotes: "/wwwroot/js/libs/showdown.footnotes",
        showdownHighlight: "/wwwroot/js/libs/showdown.highlight",
        showdownNomnoml: "/wwwroot/js/libs/showdown.nomnoml",
        syncscroll: "/wwwroot/js/libs/syncscroll",
        mustache: "/wwwroot/js/libs/mustache",
        filesaver: "/wwwroot/js/libs/filesaver",
        highlight: "/wwwroot/js/libs/highlight",
        tooltip: "/wwwroot/js/libs/tooltip",
        lodash: "/wwwroot/js/libs/lodash",
        dagre: "/wwwroot/js/libs/dagre",
        nomnoml: "/wwwroot/js/libs/nomnoml"
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
    shim: {
        dagre: {
            exports: "dagre"
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