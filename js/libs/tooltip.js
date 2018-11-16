define([
    "jquery"
], function ($) {
    //#region [ Fields ]

    var global = (function () { return this; })();
    var doc = global.document;

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Vytvorí a zobrazí tooltip.
     * 
     * @param {object} target Cieľový jquery prvok pre zobrazenie tooltipu.
     */
    function _show(target) {
        if (target[0]._tipTimeout) {
            clearTimeout(target[0]._tipTimeout);
            target[0]._tipTimeout = null;
        }

        var el = target[0]._tip = $('<div class="tip"></div>').appendTo(".app").hide();
        var pos = target.offset();
        var w = target.outerWidth();
        var h = target.outerHeight();
        var position = target.hasClass("tooltip--top") ? "top" :
                       target.hasClass("tooltip--right") ? "right" :
                       target.hasClass("tooltip--bottom") ? "bottom" :
                       target.hasClass("tooltip--left") ? "left" :
                       "top";
        var title = target.find("> .tooltip__text").html() || target.attr("title") || target.attr("data-title");
        target.attr("data-title", title).removeAttr("title");
        el.html(title);

        switch (position) {
            case "top":
                el.css({
                    top: pos.top + "px",
                    left: pos.left + (w / 2) + "px"
                }).addClass("tip--top");
                break;
            case "right":
                el.css({
                    top: pos.top + (h / 2) + "px",
                    left: (pos.left + w) + "px"
                }).addClass("tip--right");
                break;
            case "bottom":
                el.css({
                    top: (pos.top + h) + "px",
                    left: pos.left + (w / 2) + "px"
                }).addClass("tip--bottom");
                break;
            case "left":
                el.css({
                    top: pos.top + (h / 2) + "px",
                    left: pos.left + "px"
                }).addClass("tip--left");
                break;
        }

        el.show().addClass("tip--visible");
    };

    //#endregion


    //#region [ Event Handlers ]

    /**
     * Spracovanie udalosti získania focusu.
     * 
     * @param {object} e Argumenty udalosti.
     */
    function _onMouseEnter(e) {
        $(".tip").remove();

        var target = $(e.target).closest(".tooltip");

        if (target[0]._tipTimeout) {
            clearTimeout(target[0]._tipTimeout);
            target[0]._tipTimeout = null;
        }

        target[0]._tipTimeout = setTimeout(_show.bind(global, target), 200);
    };


    /**
     * Spracovanie udalosti straty focusu.
     * 
     * @param {object} e Argumenty udalosti.
     */
    function _onMouseLeave(e) {
        var target = $(e.target).closest(".tooltip");

        if (target[0]._tipTimeout) {
            clearTimeout(target[0]._tipTimeout);
            target[0]._tipTimeout = null;
            return;
        }

        var el = target[0]._tip;
        if (!el) {
            return;
        }
        el.removeClass("tip--visible").one("transitionend", function () {
            el.remove();
            el = target[0]._tip = null;
        });
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Inicializuje tooltipy. 
     */
    function init() {
        $(doc)
            .on("mouseenter focus", ".tooltip", _onMouseEnter)
            .on("mouseleave blur", ".tooltip", _onMouseLeave);
    };

    //#endregion

    return init;
});