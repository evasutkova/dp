define([
    "knockout",
    "text!./settings.html",
    "dp/polyfills/string"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("SettingsTool()");

        this.meta = args.meta || ko.observableArray([]);
        this.promptCallback = args.promptCallback;
        this.confirmCallback = args.confirmCallback;
    };

    //#endregion


    //#region [ Event Handlers ]

    /**
     * Spracovanie udalosti stlačenia klávesy.
     *
     * @param {object} model Model.
     * @param {object} e Argumenty udalosti.
     */
    Model.prototype._onKeydown = function (attribute, e) {
        if(attribute.isProtected || attribute.value()) {
            return true;
        }

        if(e.keyCode === 46) {
            this.meta.remove(attribute);
        }

        return true;
    };

    //#endregion


    //#region [ Methods : Public ]
    
    /**
     * Pridá nový atribút.
     */
    Model.prototype.add = function () {
        var prompt = this.promptCallback;
        if(typeof(prompt) !== "function") {
            console.error("SettingsTool : add() : Akcia pre otvorenie prompt dialógu nie je definovaná.");
            return;
        }

        var confirm = this.confirmCallback;
        if(typeof(confirm) !== "function") {
            console.error("SettingsTool : add() : Akcia pre otvorenie confirm dialógu nie je definovaná.");
            return;
        }

        var $this = this;
        prompt("Nový atribút", "Zadajte názov pre nový atribút", "", "Vytvoriť", "Zrušiť").then(function(label) {
            if(label === null) {
                return;
            }

            if(!label) {
                confirm("Nový atribút", "Musíte zadať názov pre nový atribút.", "Ok").then(function() {
                    $this.add();
                });
                return;
            }

            // Ziskame kluc pre atribut
            var key = label.toCodeName();

            // Overime jedinecnost klucu
            var meta = $this.meta();
            var isUnique = true;
            for(var i = 0; (i < meta.length) && isUnique; i++) {
                isUnique = meta[i].key !==  key;
            }
            if(!isUnique) {
                confirm("Nový atribút", "Atribút <b>" + label + "</b> už existuje.", "Ok").then(function() {
                    $this.add();
                });
                return;
            }
            
            // Pridame atribut do zoznamu
            $this.meta.push({
                key: key,
                label: label,
                value: ko.observable(""),
                isProtected: false
            });
        });
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~SettingsTool()");
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