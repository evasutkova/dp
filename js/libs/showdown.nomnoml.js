(function (root, factory) {
    if ((typeof (define) === "function") && define.amd) {
        // AMD. Register as an anonymous module.
        define(["showdown", "nomnoml"], factory);
    } 
    else {
        // Browser globals
        return factory(root.showdown, root.hljs);
    }
}((typeof (self) !== "undefined") ? self : this, function (showdown, nomnoml) {
    //#region [ Fields ]

    var global = (function () { return this; })();
   
    //#endregion


    //#region [ Methods : Private ]

    /**
     * Decodes input string.
     * 
     * @param {string} str String to decode.
     */
    function decimalHTMLEntities(str) {
        var html4Ents = [["apos", 39], ["nbsp", 160], ["iexcl", 161], ["cent", 162], ["pound", 163], ["Aacute", 193], ["Acirc", 194], ["Aelig", 198], ["Agrave", 192], ["Aring", 197], ["Atilde", 195], ["Auml", 196], ["Ccedil", 199], ["ETH", 208], ["Eacute", 201], ["Ecirc", 202], ["Egrave", 200], ["Euml", 203], ["Iacute", 205], ["Icirc", 206], ["Igrave", 204], ["Iuml", 207], ["Ntilde", 209], ["Oacute", 211], ["Ocirc", 212], ["Ograve", 210], ["Oslash", 248], ["Otilde", 213], ["Ouml", 214], ["THORN", 222], ["Uacute", 218], ["Ucirc", 219], ["Ugrave", 217], ["Uuml", 220], ["Yacute", 221], ["aacute", 225], ["acirc", 226], ["acute", 180], ["aelig", 230], ["agrave", 224], ["alpha", 945], ["amp", 38], ["apos", 39], ["aring", 229], ["atilde", 227], ["auml", 228], ["beta", 946], ["brvbar", 166], ["ccedil", 231], ["cedil", 184], ["cent", 162], ["chi", 967], ["circ", 710], ["copy", 169], ["curren", 164], ["deg", 176], ["delta", 948], ["divide", 247], ["eacute", 233], ["ecirc", 234], ["egrave", 232], ["epsilon", 949], ["eta", 951], ["eth", 240], ["euml", 235], ["fnof", 402], ["frac12", 189], ["frac14", 188], ["frac34", 190], ["gamma", 947], ["gt", 62], ["iacute", 237], ["icirc", 238], ["iexcl", 161], ["igrave", 236], ["iota", 953], ["iquest", 191], ["iuml", 239], ["kappa", 954], ["lambda", 955], ["laquo", 171], ["lt", 60], ["macr", 175], ["micro", 181], ["middot", 183], ["mu", 956], ["nbsp", 160], ["not", 172], ["ntilde", 241], ["nu", 957], ["oacute", 243], ["ocirc", 244], ["oelig", 339], ["ograve", 242], ["omega", 969], ["omicron", 959], ["ordf", 170], ["ordm", 186], ["otilde", 245], ["ouml", 246], ["para", 182], ["phi", 966], ["pi", 960], ["piv", 982], ["plusmn", 177], ["pound", 163], ["psi", 968], ["quot", 34], ["raquo", 187], ["reg", 174], ["rho", 961], ["scaron", 353], ["sect", 167], ["shy", 173], ["sigma", 963], ["sigmaf", 962], ["sup1", 185], ["sup2", 178], ["sup3", 179], ["szlig", 223], ["tau", 964], ["theta", 952], ["thetasym", 977], ["thorn", 254], ["tilde", 732], ["times", 215], ["uacute", 250], ["ucirc", 251], ["ugrave", 249], ["uml", 168], ["upsih", 978], ["upsilon", 965], ["uuml", 252], ["xi", 958], ["yacute", 253], ["yen", 165], ["yuml", 376], ["zeta", 950]];
        var regex = /&[^;]+;/g;
        var entities = str.match(regex);

        if(!entities) {
            return decodeHtmlEntity(str);
        }

        for (var i = 0; i < entities.length; i++) {
            entities[i] = entities[i].replace(/&|;/g, "");
            for (var j = 0; j < html4Ents.length; j++) {
                var index = html4Ents[j];
                var key = index[0];
                var value = index[1];
                if(key == entities[i]){
                    //value = "#" + value;
                    //str = str.replace(entities[i], value);
                    // FIX
                    value = "&#" + value + ";";
                    str = str.replace("&" + entities[i] + ";", value);
                }
            }
        }
        
        return decodeHtmlEntity(str);
    }


    /**
     * Decodes input string.
     * 
     * @param {string} str String to decode.
     */
    function decodeHtmlEntity(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
    };


    /**
    * Decodes input html string.
    * 
    * @param {string} str String to decode.
    */
    function decodeHtml(str) {
        if(!global.document) {
            return decimalHTMLEntities(str);
        }
        
        var div = global.document.createElement("div");
        div.innerHTML = str;
        var result = div.innerText || div.textContent;
        div = null;
        return result;
    };

    //#endregion


    //#region [ Extension ]

    var Extension = {
        type: "output",
        filter: function(text, converter, options) {
            var left  = "<pre><code class=\"uml language-uml\">";
            var right = "</code></pre>";
            var flags = "g";
            var replacement = function(wholeMatch, match, left, right) {
                if(typeof(global.document) === "undefined") {
                    return "<div class='nomnoml-source'>" + match + "</div>";
                }

                var source = decodeHtml((match || "").trim());
                if(!source.length) {
                    return "";
                }

                var data = "";
                try {
                    var canvas = global.document.createElement("canvas");
                    nomnoml.draw(canvas, source);
                    data = canvas.toDataURL();
                    canvas = null;
                }
                catch(error) {
                    console.error(error);
                    return '<p style="color:red">' + error.message + '</p>';
                }

                return '<img src="' + data + '" />';
            };

            return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
        }
    };

    // Loading extension into shodown
    showdown.extension("nomnoml", function () {
        return [Extension];
    });

    //#endregion

    return Extension;    
}));