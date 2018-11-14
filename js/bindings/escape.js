define([
    "knockout"
], function (ko) {
    //#region [ Binding ]

    ko.bindingHandlers.escape = {
        init: function (el, valueAccessor, allBindings, viewModel) {
            var callback = valueAccessor();

            el.addEventListener("keydown", function(e) {
                var keyCode = (e.which ? e.which : e.keyCode);
                if (keyCode === 27) {
                    callback.call(viewModel);
                    return false;
                }
                return true;
            });
        }
    };

    //#endregion
});