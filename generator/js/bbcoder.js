function bbcoder(code, checker) {
    try {
        var textArea = document.getElementById(checker.element.attr('id'));
        var selection = getSelected(textArea);
        var value = selection.value;
        var startPos = selection.startPos;
        var endPos = selection.endPos;
        var selectedText = value.substring(startPos, endPos);

        var offset = 1;

        var openTag = `[${code}]`;
        var closeTag = `[/${code}]`;
        var valWithTag = value.substring(startPos - openTag.length, endPos + closeTag.length);
        if (!isTagged(valWithTag, code)) {
            textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, code));
        } else {
            textArea.value = value.replaceBetween(
                startPos - openTag.length,
                endPos + closeTag.length,
                removeTag(selectedText, code)
            );
            offset = -1;
        }

        //switch (code) {
        //    case 'B':
        //        if (!isTagged(valWithTag, code)) {
        //            textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, 'B'));
        //        } else {
        //            textArea.value = value.replaceBetween(
        //                startPos - openTag.length,
        //                endPos + closeTag.length,
        //                removeTag(selectedText, 'B')
        //            );
        //            offset = -1;
        //        }
        //        break;
        //    case 'I':
        //        if (!isTagged(valWithTag, code)) {
        //            textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, 'I'));
        //        } else {
        //            textArea.value = value.replaceBetween(
        //                startPos - openTag.length,
        //                endPos + closeTag.length,
        //                removeTag(selectedText, 'I')
        //            );
        //            offset = -1;
        //        }
        //        break;
        //    case 'U':
        //        if (!isTagged(valWithTag, code)) {
        //            textArea.value = value.replaceBetween(startPos, endPos, makeTag(selectedText, 'U'));
        //        } else {
        //            textArea.value = value.replaceBetween(
        //                startPos - openTag.length,
        //                endPos + closeTag.length,
        //                removeTag(selectedText, 'U')
        //            );
        //            offset = -1;
        //        }
        //        break;
        //    case 'CENTER':
        //        if (!isTagged(valWithTag, code)) {
        //
        //        } break;
        //}

        checker.element.trigger('change');
        startPos += openTag.length * offset;
        endPos += openTag.length * offset;

        textArea.setSelectionRange(startPos, endPos);
        textArea.blur();
        textArea.focus();

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
    palette = {}
    $.each($('#color-palette button'), function(indexInArray, valueOfElement) {
        let cName = $(this).attr("data-bs-original-title");
        let cHex = "#" + $(this).val()
        palette[cHex] = cName
    });

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

    if (palette[color]) return palette[color]
    return 'Color';
}

function checkButtons(checker) {
    //var element = side == "front" ? "card-contents" : "back-contents";
    var selected = getSelected(document.getElementById(checker.element.attr('id')));
    for (const [
            key,
            value
        ] of Object.entries(checker)) {
        let code = '';
        switch (key) {
            default: code = key;
            break;
            case 'bold':
                    code = 'b';
                break;
            case 'italic':
                    code = 'i';
                break;
            case 'underline':
                    code = 'u';
                break;
        }
        let open = `[${code}]`;
        let close = `[/${code}]`;

        let textWithTags = selected.value.substring(selected.startPos - open.length, selected.endPos + close.length);
        if (isTagged(textWithTags, code)) {
            value.addClass('btn-success');
        } else value.removeClass('btn-success');
    }
    //var textWithTags = selected.value.substring(selected.openTag.length, selected.closeTag.length);

    //if (isBolded(textWithTags)) checker.bold.addClass('btn-success');
    //else checker.bold.removeClass('btn-success');
    //
    //if (isItalic(textWithTags)) checker.italic.addClass('btn-success');
    //else checker.italic.removeClass('btn-success');
    //
    //if (isUnderlined(textWithTags)) checker.underline.addClass('btn-success');
    //else checker.underline.removeClass('btn-success');
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

function isTagged(text, tag) {
    tag = tag.toUpperCase();
    text = text.toUpperCase();
    let open = `[${tag}]`;
    let close = `[/${tag}]`;

    return text.includes(open) && text.includes(close);
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