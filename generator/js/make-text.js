$(document).ready(function() {
    const fonts = getFonts();
    $dropdown = $('#font-selector');
    for (const [
            key,
            value
        ] of Object.entries(fonts)) {
        $dropdown.append($(`<option class="${key}" />`).val(key).text(value));
    }
    $dropdown.attr('class', `form-control ${Object.keys(fonts)[0]}`);
    $('#text-contents').attr('class', Object.keys(fonts)[0]);

    $('#text').change(update_text_contents);
    $('#text').keyup(text_keyup);

    $dropdown.change(function() {
        let family = $(this).val();
        $('#text-contents').attr('class', family);
        $(this).attr('class', `form-control ${family}`);
    });

    $('#bold-btn').click(function() {
        bbcoder('B', checker());
    });
    $('#italic-btn').click(function() {
        bbcoder('I', checker());
    });
    $('#underline-btn').click(function() {
        bbcoder('U', checker());
    });
    $('#align-center').click(function() {
        bbcoder('CENTER', checker());
    });
    $('#align-justify').click(function() {
        bbcoder('JUSTIFY', checker());
    });
    $('#align-right').click(function() {
        bbcoder('RIGHT', checker());
    });
    $('#align-right').click(function() {
        let color = $('fontColor').val();
        $(this).attr('value', color);
        bbcoder(`COLOR=${color}`, checker());
    });
    $('#text').mouseup(function() {
        checkButtons(checker());
    });

    $('[value=color-palette]').click(function() {
        let c = $(this).attr('data-original-title');
        let bg = '';
        switch (c) {
            case 'Parchment':
                bg = 'parchment-btn';
                break;
            case 'Dark':
                bg = 'dark-btn';
                break;
            case 'Purple Paper':
                bg = 'ppaper-btn';
                break;
        }
        $('#text-box').attr('class', `form-control ${bg}`);
    });

    $('.post-font-control, .pre-font-control').click(function() {
        controlFont($(this));
    });

    $('#fontSize').change(function() {
        $('#text-contents').css('font-size', $(this).val());
    });

    $('[data-toggle="tooltip"]').tooltip();
});

function controlFont(el) {
    let t = el.val();
    let fontSize = $('#fontSize');
    if (t === '+') {
        let newValue = parseInt(fontSize.val());
        newValue++;
        fontSize.val(newValue).change();
    } else if (t === '-') {
        let newValue = parseInt(fontSize.val());
        newValue--;
        fontSize.val(newValue).change();
    }
}

function checker() {
    return {
        element: $('#text'),
        bold: $('#bold-btn'),
        italic: $('#italic-btn'),
        underline: $('#underline-btn'),
        center: $('#align-center'),
        right: $('#align-right'),
        justify: $('#align-justify'),
        color: $('#color')
    };
}

function update_text_contents() {
    let value = $(this).val();
    value = bbcodeParser.bbcodeToHtml(value);
    $('#text-contents').html('<div>' + value.replace(/\n/g, '<br/>') + '</div>');
}

function text_keyup() {
    clearTimeout(text_keyup.timeout);
    text_keyup.timeout = setTimeout(function() {
        $('#text').trigger('change');
    }, 200);
}
text_keyup.timeout = null;

//bbcodeParser.bbcodeToHtml(result)