define([
    "knockout",
    "text!./markdown.html",
    "showdown",
    "codemirror",
    "codemirrorHtmlmixed",
    "codemirrorMarkdown",
    "codemirrorSimplescrollbars",
    "showdownFootnotes",
    "showdownHighlight"
], function (ko, view, Showdown, CodeMirror) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("MarkdownEditor()");

        this.content = args.content || ko.observable("");

        this.sd = new Showdown.Converter({
            tables: true, 
            tasklists: true, 
            strikethrough: true, 
            openLinksInNewWindow: true,
            highlightAuto: false,
            //noHeaderId: false,
            //prefixHeaderId: "x",
            //extensions: ["highlight", "materialicons", "panel", "flowchart", "mermaid"]            
            extensions: ["footnotes", "highlight"]
        });
        
        this.preview = ko.computed(this._preview, this);

        this.cm = CodeMirror(info.element.querySelector(".markdown-editor__input"), {
            lineNumbers: true,
            lineWrapping: true,
            readOnly: false,
            value: this.content(),
            mode: "markdown",
            scrollbarStyle: "overlay",
            theme: "editor--default editor--markdown",
            indentWithTabs: true,
            indentUnit: 4
        });        

        this.cm.on("change", this._cm_onChange.bind(this));

        this._content_subscription = this.content.subscribe(this._content_onChange, this);
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Generovanie náhľadu html.
     */
    Model.prototype._preview = function() {
        var content = this.content();

        return this.sd.makeHtml(content);
    };    
    
    //#endregion


    //#region [ Event Handlers ]

    /**
     * Spracovanie udalosti zmeny hodnoty editora.
     * 
     * @param {object} cm Inštancia editora CodeMirror.
     * @param {object} e Argumenty udalosti.
     */
    Model.prototype._cm_onChange = function(cm, e) {
        this.content(this.cm.getValue());
    };


    /**
     * Spracovanie udalosti zmeny obsahu.
     * 
     * @param {object} e Argumenty udalosti.
     */
    Model.prototype._content_onChange = function(e) {
        if (this.cm.getValue() === e) {
            return;
        }
        this.cm.setValue(e);
    };    

    //#endregion    


    //#region [ Methods : Public ]

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~MarkdownEditor()");

        this._content_subscription.dispose();
        this.preview.dispose();
    };

    //#endregion


    //#region [ Methods : Static ]

    /**
	 * Factory method.
	 *
	 * @param {object} params Parameters.
     * @param {object} componentInfo Component into.
     * @returns {object} Instance of the model.
	 */
    Model.createViewModel = function (params, componentInfo) {
        return new Model(params, componentInfo);
    };

    //#endregion

    return {
        viewModel: { createViewModel: Model.createViewModel },
        template: view
    };
});