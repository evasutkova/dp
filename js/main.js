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
    ko.components.register("images-tool", { require: "dp/components/tools/images/images" });
    ko.components.register("cheatsheet-tool", { require: "dp/components/tools/cheatsheet/cheatsheet" });
    ko.components.register("emoji-tool", { require: "dp/components/tools/emoji/emoji" });
    ko.components.register("prompt-modal", { require: "dp/components/modals/prompt/prompt" });
    ko.components.register("confirm-modal", { require: "dp/components/modals/confirm/confirm" });
    ko.components.register("file-browser-modal", { require: "dp/components/modals/file-browser/file-browser" });
    ko.components.register("window-modal", { require: "dp/components/modals/window/window" });
    ko.components.register("template-editor", { require: "dp/components/editors/template/template" });
    ko.components.register("markdown-editor", { require: "dp/components/editors/markdown/markdown" });
    ko.components.register("image-editor", { require: "dp/components/editors/image/image" });
    ko.components.register("script-editor", { require: "dp/components/editors/script/script" });
    ko.components.register("loader", { require: "dp/components/loader/loader" });
    ko.components.register("syncscroll", { require: "dp/components/syncscroll/syncscroll" });
    ko.components.register("keywords", { require: "dp/components/keywords/keywords" });
    ko.components.register("node-id", { require: "dp/components/node-id/node-id" });
    ko.components.register("new-node-action", { require: "dp/components/actions/new-node/new-node" });
    ko.components.register("new-image-action", { require: "dp/components/actions/new-image/new-image" });
    ko.components.register("new-script-action", { require: "dp/components/actions/new-script/new-script" });
    ko.components.register("new-project", { require: "dp/components/new-project/new-project" });

    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });

    // Osetrenie opustenia aplikacie
    $(window).on("beforeunload", function (e) {
        // Cancel the event as stated by the standard.
        e.preventDefault();
        // Chrome requires returnValue to be set.
        e.returnValue = "";
      });
});