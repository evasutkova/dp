define([
    "knockout",
    "materialize",
    "text!./prompt.html",
    "dp/bindings/enter"
], function (ko, M, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("PromptModal()");

        this._resolve = null;

        this.title = ko.observable("");
        this.text = ko.observable("");
        this.value = ko.observable("");
        this.yes = ko.observable("");
        this.no = ko.observable("");

        this.modal = M.Modal.init(info.element.querySelector(".prompt-modal"), {
            dismissible: false,
            onOpenEnd: function (modal, trigger) {
                modal.querySelector("input[type=text]").focus();
            }
        });

        if (typeof (args.openAction) === "function") {
            args.openAction(this.open.bind(this));
        }
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Zobrazí prompt.
     * 
     * @param {string} title Nadpis.
     * @param {string} text Text.
     * @param {string} value Základná hodnota.
     * @param {string} yes Text pre potvrdenie.
     * @param {string} no Text pre zrušenie.
     */
    Model.prototype.open = function (title, text, value, yes, no) {
        this.title(title || "");
        this.text(text || "");
        this.value(value || "");
        this.yes(yes || "Áno");
        this.no(no || "Nie");

        this.modal.open();

        var $this = this;
        return new Promise(function(resolve) {
            $this._resolve = resolve;
        });        
    };


    /**
     * Zavrie prompt.
     * 
     * @param {string} value Výsledok promptu.
     */
    Model.prototype.close = function (value) {
        this.modal.close();

        if (this._resolve) {
            this._resolve(ko.unwrap(value));
            this._resolve = null;
        }
    };      


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~PromptModal()");
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