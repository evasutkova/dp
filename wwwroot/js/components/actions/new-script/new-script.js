define([
    "knockout",
    "text!./new-script.html"
], function (ko, view) {
    //#region [ Constructor ]

    /**
	 * Konštruktor.
	 *
	 * @param {object} args Argumenty.
     * @param {object} info Komponent info.
	 */
    var Model = function (args, info) {
        console.log("NewScriptAction()");

        this.addScriptCallback = args.addScriptCallback;
        this.selectScriptCallback = args.selectScriptCallback;
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Vytvorí nový skript.
     */    
    Model.prototype.add = function () {
        if ((typeof (this.addScriptCallback) !== "function") 
            || (typeof (this.selectScriptCallback) !== "function")) {
            return;
        }
    
        var $this = this;
        
        this.addScriptCallback().then(function(script) {
            if(!script) {
                return;
            }

            $this.selectScriptCallback(script);
        });
    };


    /**
     * Dispose.
     */
    Model.prototype.dispose = function () {
        console.log("~NewScriptAction()");
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