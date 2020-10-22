function bbcoder(code, textAreaID) {
	try {
		var textArea = document.getElementById(textAreaID);
		var selection = getSelected(textArea);
		var value = selection.value;
		var startPos = selection.startPos;
		var endPos = selection.endPos;
		var selectedText = value.substring(startPos, endPos);

		var offset = 1;

		switch (code) {
			case "B":
				if (!isBolded(value.substring(startPos - 3, endPos + 4))) {
					textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, "B"));
				} else {
					textArea.value = value.replaceBetween(startPos - 3, endPos + 4, removeTag(selectedText, "B"));
					offset = -1;
				}
				break;
			case "I":
				if (!isItalic(value.substring(startPos - 3, endPos + 4))) {
					textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, "I"));
				} else {
					textArea.value = value.replaceBetween(startPos - 3, endPos + 4, removeTag(selectedText, "I"));
					offset = -1;
				}
				break;
			case "U":
				if (!isUnderlined(value.substring(startPos - 3, endPos + 4))) {
					textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, "U"));
				} else {
					textArea.value = value.replaceBetween(startPos - 3, endPos + 4, removeTag(selectedText, "U"));
					offset = -1;
				}
				break;
		}

		$("#" + textAreaID).trigger("change");
		startPos += 3 * offset;
		endPos += 3 * offset;
		textArea.focus();
		textArea.setSelectionRange(startPos, endPos);
		checkButtons(textAreaID == "card-contents" ? "front" : "back");
	} catch (e) {
		alert(e.toString());
	}
}

function getSelected(textArea) {
	var value = textArea.value;
	var startPos = textArea.selectionStart;
	var endPos = textArea.selectionEnd;
	return { value: value, startPos: startPos, endPos: endPos };
}

$(document).ready(function () {
	$("#bold-front").click(function () {
		bbcoder("B", "card-contents");
	});
	$("#italic-front").click(function () {
		bbcoder("I", "card-contents");
	});
	$("#underline-front").click(function () {
		bbcoder("U", "card-contents");
	});

	$("#bold-back").click(function () {
		bbcoder("B", "back-contents");
	});
	$("#italic-back").click(function () {
		bbcoder("I", "back-contents");
	});
	$("#underline-back").click(function () {
		bbcoder("U", "back-contents");
	});

	$("#card-contents").mouseup(function () {
		checkButtons("front");
		checkTag("front");
	});
	$("#back-contents").mouseup(function () {
		checkButtons("back");
		checkTag("back");
	});

	$("#tag-selector-front").change(function () {
		var tag = $("option:selected", this).val();
		$("#tag-selector-explanation").html(card_elemement_generators_expanation[tag]);
	});

	$("#mkweapon-front").click(function () {
		let quality = colorTranslator($("#card-color").val());
		let txt =
			`subtitle | ${quality} Weapon Type (Attunement)\n` +
			"rule\n" +
			"property | Damage | damage\n" +
			"property | Modifier | mod\n" +
			"property | Properties | props\n" +
			"rule\n";
		let curr = $("#card-contents").val();
		$("#card-contents")
			.val(curr.length > 0 ? `${curr}\n${txt}` : txt)
			.change();
	});
	$("#mkweapon-back").click(function () {
		let quality = colorTranslator($("#card-color").val());
		let txt =
			`subtitle | ${quality} Weapon Type (Attunement)\n` +
			"rule\n" +
			"property | Damage | damage\n" +
			"property | Modifier | mod\n" +
			"property | Properties | props\n" +
			"rule\n";
		let curr = $("#back-contents").val();
		$("#back-contents")
			.val(curr.length > 0 ? `${curr}\n${txt}` : txt)
			.change();
	});
});

function colorTranslator(color) {
	switch (color) {
		case "green":
		case "#008000":
			return "Uncommon";
		case "navy":
		case "#000080":
			return "Rare";
		case "blueviolet":
		case "#8a2be2":
			return "Very Rare";
		case "#c46709":
			return "Legendary";
	}
	return "Color";
}

function checkButtons(side) {
	var element = side == "front" ? "card-contents" : "back-contents";
	var selected = getSelected(document.getElementById(element));
	var textWithTags = selected.value.substring(selected.startPos - 3, selected.endPos + 4);
	if (isBolded(textWithTags)) $("#bold-" + side).addClass("btn-success");
	else $("#bold-" + side).removeClass("btn-success");

	if (isItalic(textWithTags)) $("#italic-" + side).addClass("btn-success");
	else $("#italic-" + side).removeClass("btn-success");

	if (isUnderlined(textWithTags)) $("#underline-" + side).addClass("btn-success");
	else $("#underline-" + side).removeClass("btn-success");
}

function checkTag(side) {
	var element = side == "front" ? "card-contents" : "back-contents";
	var cursorPos = getCursorPos(element);
	var tag = findTag(cursorPos, document.getElementById(element).value);
	if (tag != "") $("#tag-selector-" + side).val(tag);
}

function getCursorPos(element) {
	return $("#" + element).prop("selectionStart");
}

function changeTag(currentTag, newTag) {}

function findTag(cursorPos, text) {
	var beg = findBeginningOfLine(cursorPos, text);
	var end = findEndOfLine(cursorPos, text);
	var line = text.substring(beg, end);
	return line.split("|")[0].trim();
}

function findBeginningOfLine(cursorPos, val) {
	//console.log(val);
	var index = cursorPos;
	if (val[index] == "\n") index--;
	do {
		var curr = val[index];
		if (curr == "\n") {
			return index;
		}
		index--;
	} while (val[index]);
	return -1;
}

function findEndOfLine(cursorPos, val) {
	//console.log(val);
	var index = cursorPos;
	if (val[index] == "\n") index--;
	do {
		var curr = val[index];
		if (curr == "\n") {
			return index;
		}
		index++;
	} while (val[index]);
	return -1;
}

function isBolded(text) {
	text = text.toUpperCase();
	return text.includes("[B]") && text.includes("[/B]");
}
function isItalic(text) {
	text = text.toUpperCase();
	return text.includes("[I]") && text.includes("[/I]");
}
function isUnderlined(text) {
	text = text.toUpperCase();
	return text.includes("[U]") && text.includes("[/U]");
}

function removeTag(text, tag) {
	text = text.replace("[" + tag + "]");
	text = text.replace("[/" + tag + "]");
	return text;
}

function makeTag(text, tag) {
	return "[" + tag + "]" + text + "[/" + tag + "]";
}

//http://stackoverflow.com/questions/14880229/how-to-replace-a-substring-between-two-indices
String.prototype.replaceBetween = function (start, end, what) {
	return this.substring(0, start) + what + this.substring(end);
};
