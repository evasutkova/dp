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
    ko.components.register("confirm-modal", { require: "dp/components/modals/confirm/confirm" });
    ko.components.register("file-browser-modal", { require: "dp/components/modals/file-browser/file-browser" });
    ko.components.register("window-modal", { require: "dp/components/modals/window/window" });
    ko.components.register("template-editor", { require: "dp/components/editors/template/template" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});