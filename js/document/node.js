define([
    "knockout"
], function (ko) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
	 */
    var Model = function (args) {
        console.log("Node()");

        this.parent = args.parent || null;
        this.title = ko.observable(args.title || "");
        this.nodes = ko.observableArray(args.nodes || []);
        this.keywords = ko.observable(args.keywords || "");
        this.isExpanded = ko.observable(args.isExpanded || false);
        this.isActive = ko.observable(args.isActive || false);
        this.isInToc = ko.observable(args.isInToc || false);
        this.content = ko.observable(args.content || "").extend({ rateLimit: 500 });
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vytvorí nový uzol.
     * 
     * @param {string} title Nadpis nového uzla.
     */
    Model.prototype.add = function (title) {
        var node = new Model({
            title: title,
            isInToc: true,
            parent: this
        });
        this.nodes.push(node);
        return node;
    };


    /**
     * Odstráni uzol.
     * 
     * @param {object} node Uzol ktorý sa má odstrániť.
     */
    Model.prototype.remove = function (node) {
        this.nodes.remove(node);
    };   


    /**
     * Vygeneruje JSON reprezentáciu.
     */
    Model.prototype.toJson = function() {
        var n = {
            title: this.title(),
            content: this.content()
        };

        var tmp = this.isActive();
        if(tmp) {
            n.isActive = tmp;
        }

        tmp = this.isExpanded();
        if(tmp) {
            n.isExpanded = tmp;
        }

        tmp = this.isInToc();
        if(tmp) {
            n.isInToc = tmp;
        }
        
        tmp = this.keywords();
        if(tmp) {
            n.keywords = tmp;
        }

        tmp = this.nodes();
        if(tmp.length) {
            n.nodes = tmp.map(function(i) {
                return i.toJson();
            });
        }

        return n;
    };

    
    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~Node()");
    };

    //#endregion


    //#region [ Methods : Static ]

    /**
     * Vráti zoznam referencovaných obrázkov.
     * 
     * 
     * @param {string} content Markdown text.
     */
    Model.getReferencedImages = function(content) {
        content = content || "";

        if(!content) {
            return [];
        }

        var references = [];

        var regex = /!\[[^\[\]]+\]\[([^\[\]]+)\]/g;
        var match = regex.exec(content);
        while (match != null) {
            if(match[1] && (references.indexOf(match[1]) === -1)) {
                references.push(match[1]);
            }
            match = regex.exec(content);
        }

        return references;
    };

    //#endregion

    return Model;
});