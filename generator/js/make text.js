$(document).ready(function() {
    const fonts = getFonts();
    $dropdown = $('#font-selector');
    for (const [
            key,
            value
        ] of Object.entries(fonts)) {
        $dropdown.append($('<option />').val(key).text(value));
    }

    $('#text').change(update_text_contents);
    $('#text').keyup(text_keyup);

    $dropdown.change(function() {
        let family = $(this).val();
        $('#text-contents').attr('class', family);
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
    $('#text').mouseup(function() {
        checkButtons(checker());
    });

    $('[data-toggle="tooltip"]').tooltip();
});

function checker() {
    return {
        element: $('#text'),
        bold: $('#bold-btn'),
        italic: $('#italic-btn'),
        underline: $('#underline-btn')
    };
}

function update_text_contents() {
    let value = $(this).val();
    value = bbcodeParser.bbcodeToHtml(value);
    $('#text-contents').html('<div>' + value + '</div>');
}

function text_keyup() {
    clearTimeout(text_keyup.timeout);
    text_keyup.timeout = setTimeout(function() {
        $('#text').trigger('change');
    }, 200);
}
text_keyup.timeout = null;

//bbcodeParser.bbcodeToHtml(result)