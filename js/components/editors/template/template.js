define([
    "knockout",
    "text!./template.html",
    "codemirror",
    "codemirrorHtmlmixed",
    "codemirrorSimplescrollbars"
], function (ko, view, CodeMirror) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("TemplateEditor()");

        this.content = args.content || ko.observable("");

        this.cm = CodeMirror(info.element.querySelector(".template-editor"), {
            lineNumbers: true,
            lineWrapping: true,
            readOnly: false,
            value: this.content(),
            mode: "htmlmixed",
            scrollbarStyle: "overlay",
            theme: "editor--default"
        });

        this.cm.on("change", this._cm_onChange.bind(this));
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

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~TemplateEditor()");
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