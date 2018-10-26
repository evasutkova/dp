define([
    "text!./settings.html"
], function (view) {
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
        prompt("Nový atribút", "Zadajte názov pre nový atribút", "", "Vytvoriť", "Zrušiť").then(function(r) {
            if(r === null) {
                return;
            }

            if(!r) {
                confirm("Nový atribút", "Musíte zadať názov pre nový atribút.", "Ok").then(function() {
                    $this.add();
                });
                return;
            }
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