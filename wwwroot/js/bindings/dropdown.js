define([
    "knockout",
    "materialize"
], function (ko, M) {
    //#region [ Binding ]

    ko.bindingHandlers.dropdown = {
        init: function (el, valueAccessor, allBindings, viewModel) {
            var args = ko.unwrap(valueAccessor()) || {};

            // Nastavenie atributov
            el.setAttribute("data-target", args.target);

            // Nastavenie css tried
            if (el.classList) {
                el.classList.add("dropdown-trigger");
            }
            else {
                el.className += " dropdown-trigger";
            }

            // Osetrenie udalosti click
            el.addEventListener("click", function (e) {
                e.stopPropagation();
            });

            // Vytvorenie dropdown
            setTimeout(function () {
                el._dropdown = M.Dropdown.init(el, args);
            }, 0);
        }
    };

    //#endregion
});