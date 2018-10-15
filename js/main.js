define([
    "jquery",
    "knockout",
    "materialize"
], function ($, ko, M) {
    // Registracia komponentov
    ko.components.register("app", { require: "dp/components/app/app" });
    ko.components.register("toolbar", { require: "dp/components/toolbar/toolbar" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});