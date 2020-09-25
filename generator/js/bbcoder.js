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
	});
	$("#back-contents").mouseup(function () {
		checkButtons("back");
	});
});

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
