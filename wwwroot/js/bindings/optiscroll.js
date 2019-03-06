define([
    "knockout",
    "optiscroll"
], function (ko, Optiscroll) {
    //#region [ Binding ]

    ko.bindingHandlers.optiscroll = {
        init: function (el, valueAccessor, allBindings, viewModel) {
            var args = ko.unwrap(valueAccessor()) || {};

            if (el.classList) {
                el.classList.add("optiscroll");
            }
            else {
                el.className += " optiscroll";
            }

            el._optiscroll = new Optiscroll(el, args);
        }
    };

    //#endregion
});