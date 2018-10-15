define([
    "jquery",
    "knockout",
    "materialize"
], function ($, ko, M) {
    // Registracia komponentov
    ko.components.register("app", { require: "dp/components/app/app" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});