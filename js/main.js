define([
    "jquery",
    "knockout",
    "materialize"
], function ($, ko, M) {
    // Registracia komponentov
    ko.components.register("app", { require: "dp/components/app/app" });
    ko.components.register("toolbar", { require: "dp/components/toolbar/toolbar" });
    ko.components.register("drive-tool", { require: "dp/components/tools/drive/drive" });
    ko.components.register("explorer-tool", { require: "dp/components/tools/explorer/explorer" });
    ko.components.register("settings-tool", { require: "dp/components/tools/settings/settings" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});