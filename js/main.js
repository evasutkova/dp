define([
    "jquery",
    "knockout",
    "materialize"
], function ($, ko, M) {
    // Registracia komponentov
    ko.components.register("app", { require: "dp/components/app/app" });
    ko.components.register("toolbar", { require: "dp/components/toolbar/toolbar" });
    ko.components.register("user", { require: "dp/components/user/user" });
    ko.components.register("drive-tool", { require: "dp/components/tools/drive/drive" });
    ko.components.register("explorer-tool", { require: "dp/components/tools/explorer/explorer" });
    ko.components.register("settings-tool", { require: "dp/components/tools/settings/settings" });
    ko.components.register("prompt-modal", { require: "dp/components/modals/prompt/prompt" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});