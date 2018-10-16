define([
    "jquery",
    "knockout",
    "materialize"
], function ($, ko, M) {
    // Registracia komponentov
    ko.components.register("app", { require: "dp/components/app/app" });
    ko.components.register("toolbar", { require: "dp/components/toolbar/toolbar" });
    ko.components.register("driveTool", { require: "dp/components/tools/drive/drive" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});