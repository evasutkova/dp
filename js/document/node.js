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
     * Index uzla v zozname uzlov v rámci rodičovského uzla.
     */
    Model.prototype.index = function () {
        if (!this.parent) {
            return -1;
        }
        var nodes = this.parent.nodes();
        return nodes.indexOf(this);
    };   


    /**
     * Vráti true ak sa uzol môže posunúť smerom nahor v rámci zoznamu uzlov rodičovského uzla.
     */
    Model.prototype.canMoveUp = function () {
        return this.index() > 0;
    };   


    /**
     * Vráti true ak sa uzol môže posunúť smerom nadol v rámci zoznamu uzlov rodičovského uzla.
     */
    Model.prototype.canMoveDown = function () {
        return this.index() < this.parent.nodes().length - 1;
    }; 


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~Node()");
    };

    //#endregion

    return Model;
});