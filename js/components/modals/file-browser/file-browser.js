define([
    "knockout",
    "materialize",
    "text!./file-browser.html"
], function (ko, M, view) {
    //#region [ Fields ]

    var global = (function () { return this; })();

    //#endregion


    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("FileBrowserModal()");

        this._resolve = null;

        this.mode = ko.observable("text");
        this.title = ko.observable("");
        this.text = ko.observable("");
        this.yes = ko.observable("");
        this.no = ko.observable("");
        this.value = ko.observable("");
        this.files = ko.observableArray([]);

        this.modal = M.Modal.init(info.element.querySelector(".file-browser-modal"), {
            dismissible: false,
            onOpenEnd: function (modal, trigger) {
                modal.querySelector(".file-browser-modal__value").focus();
                modal.querySelector("input[type=file]").click();
            }
        });

        this._file = info.element.querySelector("input[type=file]");

        if (typeof (args.openAction) === "function") {
            args.openAction(this.open.bind(this));
        }
    };

    //#endregion


    //#region [ Event Handlers ]

    /**
     * Event handler for the file input change event.
     * 
     * @param {object} model Viewmodel.
     * @param {object} e Event arguments.
     */
    Model.prototype._file_onChange = function (model, e) {
        this.modal.el.querySelector(".file-browser-modal__value").focus();

        if (!global.FileReader) {
            console.warn("FileBrowserModal : _file_onChange() : FileReader is not supported.");
            return;
        }

        var $this = this;
        Array.prototype.forEach.call(e.target.files, function(f, i) {
            var name = f.name;

            var reader = new FileReader();

            reader.onload = function (e) {
                if (e.target.readyState != 2) {
                    return;
                }
                if (e.target.error) {
                    console.error("FileBrowserModal : _file_onChange() : Error while reading file.");
                    return;
                }

                $this.files.push({
                    name: name,
                    content: e.target.result
                });
            };

            if ($this.mode() === "dataUrl") {
                reader.readAsDataURL(f);
            }
            else if ($this.mode() === "arrayBuffer") {
                reader.readAsArrayBuffer(f);
            }
            else {
                reader.readAsText(f);
            }
        });
    };

    //#endregion    


    //#region [ Methods : Public ]

    /**
     * Zobrazí file browser.
     * 
     * @param {string} title Nadpis.
     * @param {string} text Text.
     * @param {string} mode Mód.
     * @param {boolean} multiple Ak je true je možné vybrať viacero súborov naraz.
     * @param {string} yes Text pre potvrdenie.
     * @param {string} no Text pre zrušenie.
     */
    Model.prototype.open = function (title, text, mode, multiple, yes, no) {
        multiple = (typeof(multiple) === "boolean") ? multiple : false;
        mode = mode || "text";
        
        if (multiple) {
            this._file.setAttribute("multiple", "multiple"); 
        }
        else {
            this._file.removeAttribute("multiple");
        }
        
        this.mode(mode);
        this.value("");
        this.files([]);
        this.title(title || "");
        this.text(text || "");
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
        console.log("~FileBrowserModal()");
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