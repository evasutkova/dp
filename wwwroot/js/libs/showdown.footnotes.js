(function (root, factory) {
	if ((typeof (define) === "function") && define.amd) {
		define(["showdown"], factory);
	} 
	else {
		return factory(root.showdown);
	}
}((typeof (self) !== "undefined") ? self : this, function (showdown) {
	//#region [ Extension ]
	
	/**
	 * Use footnotes like so: "foo[^1](This is the footnote text)"
	 * 
	 * Source: https://gist.github.com/harryfk/84a7836d881429d35231
	 */
	var Extension = { 
		type: "lang", 
		filter: function(text) {
			var inline_regex = /\[\^(\d|n)\]\((.*?)\)/g;
			var i = 0;
			var notes = [];

			text = text.replace(inline_regex, function(match, n, t) {
				// We allow both automatic and manual footnote numbering
				if (n == "n") {
					n = i + 1;
				};

				var s = '<a class="footnote" href="#footnote-' + n + '"><sup>' + n + '</sup></a>';

				notes.push('<li id="footnote-' + n + '" class="footnotes__item"><sup>' + n + '</sup><span>' + t + '</span></li>');
				
				i++;
				return s;
			});

			if(notes.length) {
				text += ('<ul class="footnotes">' + notes.join("\n") + '</ul>');
			}

			return text;
		}
	};

	// Loading extension into shodown
	showdown.extension("footnotes", function () {
		return [Extension];
	});

	//#endregion

	return Extension;   
}));