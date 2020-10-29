function bbcoder(code, checker) {
    try {
        var textArea = document.getElementById(checker.element.attr('id'));
        var selection = getSelected(textArea);
        var value = selection.value;
        var startPos = selection.startPos;
        var endPos = selection.endPos;
        var selectedText = value.substring(startPos, endPos);

        var offset = 1;

        switch (code) {
            case 'B':
                if (!isBolded(value.substring(startPos - 3, endPos + 4))) {
                    textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, 'B'));
                } else {
                    textArea.value = value.replaceBetween(startPos - 3, endPos + 4, removeTag(selectedText, 'B'));
                    offset = -1;
                }
                break;
            case 'I':
                if (!isItalic(value.substring(startPos - 3, endPos + 4))) {
                    textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, 'I'));
                } else {
                    textArea.value = value.replaceBetween(startPos - 3, endPos + 4, removeTag(selectedText, 'I'));
                    offset = -1;
                }
                break;
            case 'U':
                if (!isUnderlined(value.substring(startPos - 3, endPos + 4))) {
                    textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, 'U'));
                } else {
                    textArea.value = value.replaceBetween(startPos - 3, endPos + 4, removeTag(selectedText, 'U'));
                    offset = -1;
                }
                break;
        }

        checker.element.trigger('change');
        startPos += 3 * offset;
        endPos += 3 * offset;
        textArea.focus();
        textArea.setSelectionRange(startPos, endPos);
        checkButtons(checker);
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

function colorTranslator(color) {
    switch (color) {
        case 'green':
        case '#008000':
            return 'Uncommon';
        case 'navy':
        case '#000080':
            return 'Rare';
        case 'blueviolet':
        case '#8a2be2':
            return 'Very Rare';
        case '#c46709':
            return 'Legendary';
    }
    return 'Color';
}

function checkButtons(checker) {
    //var element = side == "front" ? "card-contents" : "back-contents";
    var selected = getSelected(document.getElementById(checker.element.attr('id')));
    var textWithTags = selected.value.substring(selected.startPos - 3, selected.endPos + 4);
    if (isBolded(textWithTags)) checker.bold.addClass('btn-success');
    else checker.bold.removeClass('btn-success');

    if (isItalic(textWithTags)) checker.italic.addClass('btn-success');
    else checker.italic.removeClass('btn-success');

    if (isUnderlined(textWithTags)) checker.underline.addClass('btn-success');
    else checker.underline.removeClass('btn-success');
}

function checkTag(side) {
    var element = side == 'front' ? 'card-contents' : 'back-contents';
    var cursorPos = getCursorPos(element);
    var tag = findTag(cursorPos, document.getElementById(element).value);
    if (tag != '') $('#tag-selector-' + side).val(tag);
}

function getCursorPos(element) {
    return $('#' + element).prop('selectionStart');
}

function changeTag(currentTag, newTag) {}

function findTag(cursorPos, text) {
    var beg = findBeginningOfLine(cursorPos, text);
    var end = findEndOfLine(cursorPos, text);
    var line = text.substring(beg, end);
    return line.split('|')[0].trim();
}

function findBeginningOfLine(cursorPos, val) {
    //console.log(val);
    var index = cursorPos;
    if (val[index] == '\n') index--;
    do {
        var curr = val[index];
        if (curr == '\n') {
            return index;
        }
        index--;
    } while (val[index]);
    return -1;
}

function findEndOfLine(cursorPos, val) {
    //console.log(val);
    var index = cursorPos;
    if (val[index] == '\n') index--;
    do {
        var curr = val[index];
        if (curr == '\n') {
            return index;
        }
        index++;
    } while (val[index]);
    return -1;
}

function isBolded(text) {
    text = text.toUpperCase();
    return text.includes('[B]') && text.includes('[/B]');
}

function isItalic(text) {
    text = text.toUpperCase();
    return text.includes('[I]') && text.includes('[/I]');
}

function isUnderlined(text) {
    text = text.toUpperCase();
    return text.includes('[U]') && text.includes('[/U]');
}

function removeTag(text, tag) {
    text = text.replace('[' + tag + ']');
    text = text.replace('[/' + tag + ']');
    return text;
}

function makeTag(text, tag) {
    return '[' + tag + ']' + text + '[/' + tag + ']';
}

//http://stackoverflow.com/questions/14880229/how-to-replace-a-substring-between-two-indices
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};