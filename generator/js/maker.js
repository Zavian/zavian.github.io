$(document).ready(function() {
    $('input').on('input', function() { generate() })
    $('#color').on('input', function(e) {
        $('#color-hex').val($('#color').val());
        $('#color-hex').trigger('change');
    });
    $('#color-hex').change(function(e) {
        $('#color').val($('#color-hex').val());
        $('#title').css('color', $('#color-hex').val());
    });

    $('#copy-text').click(function(e) {
        var c = document.getElementById('result');
        copyText(c);
    });
});

function generate() {
    let title = $('#title').val();
    let color = $('#color-hex').val() || $('#color').val() || '#ffffff';;
    let description = $('#description').val() || '';
    let lore = $('#lore').val() || '';
    let price = $('#price').val() || '';
    console.log([
        title,
        color,
        description,
        lore,
        price
    ]);

    if (title != '' && description != '') {
        let result = makeResult(title, description, lore, color, price);
        $('#result').text(JSON.stringify(result, null, 4));
    }
}

function makeResult(title, description, lore, color, price) {
    if (color != '' && color != null) {
        color = color.replace('#', '');
        title = `[${color}][b]${title}[/b][-]. `;
    } else {
        title = `[b]${title}[/b]. `;
    }

    let price_val = null;
    if (price != '' && price != null) {
        price_val = `([ffc000]${price}gp[-])`;
        title = price_val + ' ' + title;
    }

    let lore_val = null;
    if (lore != '' && lore != null) {
        lore = lore.replace('\n', ' ');
        lore_val = `[be8008][i]${lore}[/i][-]`;
    }

    result = {
        title: title,
        description: description,
        lore: lore_val,
        color: color
    };

    return result;
}

function parseResult(result) {
    let r = `{
        "title":"${result.title}",
        "description":"${result.description}"`;
    if (result.lore) r += `, "lore":"${result.lore}"`;
    if (result.color) r += `, "color": "${result.color}"`;

    r += '}';
    return r;
}

function copyText(element) {
    var range, selection, worked;

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    try {
        document.execCommand('copy');
        console.log('Text copied');
    } catch (err) {
        console.log(err);
    }
}