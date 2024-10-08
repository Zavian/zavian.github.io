// Ugly global variable holding the current card deck
var card_data = [];
var card_options = card_default_options();

function mergeSort(arr, compare) {
    if (arr.length < 2) return arr;

    var middle = parseInt(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle, arr.length);

    return merge(mergeSort(left, compare), mergeSort(right, compare), compare);
}

function merge(left, right, compare) {
    var result = [];

    while (left.length && right.length) {
        if (compare(left[0], right[0]) <= 0) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length) result.push(left.shift());

    while (right.length) result.push(right.shift());

    return result;
}

var ui_generate_modal_shown = false;

function ui_generate() {
    if (card_data.length === 0) {
        alert('Your deck is empty. Please define some cards first, or load the sample deck.');
        return;
    }

    // Generate output HTML
    var card_html = card_pages_generate_html(card_data, card_options);

    // Open a new window for the output
    // Use a separate window to avoid CSS conflicts
    var tab = window.open('output.html', 'rpg-cards-output');

    if (ui_generate_modal_shown === false) {
        $('#print-modal').modal('show');
        ui_generate_modal_shown = true;
    }

    // Send the generated HTML to the new window
    // Use a delay to give the new window time to set up a message listener
    setTimeout(function() {
        tab.postMessage(card_html, '*');
    }, 500);
}

function ui_clear_all() {
    card_data = [];
    ui_update_card_list();
}

function ui_load_files(evt) {
    // ui_clear_all();

    var files = evt.target.files;

    for (var i = 0, f;
        (f = files[i]); i++) {
        var reader = new FileReader();

        reader.onload = function(reader) {
            var data = JSON.parse(this.result);
            ui_add_cards(data);
        };

        reader.readAsText(f);
    }

    // Reset file input
    $('#file-load-form')[0].reset();
}

function ui_init_cards(data) {
    data.forEach(function(card) {
        card_init(card);
    });
}

function ui_add_cards(data) {
    ui_init_cards(data);
    card_data = card_data.concat(data);
    ui_update_card_list();
}

function ui_add_new_card() {
    card_data.push(card_default_data());
    ui_update_card_list();
    ui_select_card_by_index(card_data.length - 1);

}

function ui_add_new_card_with_data(data, dontUpdate) {
    card_init(data);
    card_data = card_data.concat(data);
    if (!dontUpdate) {
        ui_update_card_list();
        ui_select_card_by_index(card_data.length - 1);
    }
}

function ui_update() {
    ui_update_card_list();
    ui_select_card_by_index(card_data.length - 1);
}

function ui_duplicate_card() {
    if (card_data.length > 0) {
        var old_card = ui_selected_card();
        var new_card = $.extend({}, old_card);
        card_data.push(new_card);
        new_card.title = new_card.title + ' (Copy)';
    } else {
        card_data.push(card_default_data());
    }
    ui_update_card_list();
    ui_select_card_by_index(card_data.length - 1);
}

function ui_select_card_by_index(index) {
    // $('#selected-card').val(index);
    document.querySelector("#selected-card").fstdropdown.setValue(index)
    ui_update_selected_card();
}

function ui_selected_card_index() {
    return parseInt($('#selected-card').val(), 10);
}

function ui_selected_card() {
    return card_data[ui_selected_card_index()];
}

function ui_delete_card() {
    var index = ui_selected_card_index();
    card_data.splice(index, 1);
    ui_update_card_list();
    ui_select_card_by_index(Math.min(index, card_data.length - 1));
}

function ui_update_card_list() {
    $('#deck-size').text('Deck contains ' + card_data.length + ' unique cards.');

    $('#selected-card').empty();
    for (var i = 0; i < card_data.length; ++i) {
        var card = card_data[i];
        let option = `<option value="${i}">${card.title}</option>`
        $('#selected-card').append(option);
    }
    try {
        // need a try catch on the first load or it breaks shit
        document.querySelector("#selected-card").fstdropdown.rebind();
    } catch (error) {

    }

    ui_update_selected_card();
}



function ui_save_file() {
    var str = JSON.stringify(card_data, null, '  ');
    var parts = [
        str
    ];
    var blob = new Blob(parts, { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    var a = $('#file-save-link')[0];
    a.href = url;
    a.download = 'rpg_cards.json';
    if (a.download) {
        ui_save_file.filename = a.download;
        a.click();
    }

    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 500);
}
ui_save_file.filename = 'rpg_cards.json';

function ui_update_selected_card() {
    var card = ui_selected_card();
    if (card) {
        $('#card-title').val(card.title);
        $('#card-title-size').val(card.title_size);
        $('#card-count').val(card.count);
        $('#card-icon').val(card.icon);
        $('#card-icon-back').val(card.icon_back);
        $('#card-background').val(card.background_image);
        $('#card-contents').val(card.contents.join('\n'));
        $('#card-tags').val(card.tags.join(', '));
        $('#card-color').val(card.color).change();
        $('#back-text').prop('checked', card.background_text_toggle);
        if (card.background_text_toggle) $('#form-back').show();
        else $('#form-back').hide();
        $('#back-contents').val(card.back_contents.join('\n'));
    } else {
        $('#card-title').val('');
        $('#card-title-size').val('');
        $('#card-count').val(1);
        $('#card-icon').val('');
        $('#card-icon-back').val('');
        $('#card-background').val('');
        $('#card-contents').val('');
        $('#card-tags').val('');
        $('#card-color').val('').change();
    }

    ui_render_selected_card();
}

function ui_render_selected_card() {
    var card = ui_selected_card();
    $('#preview-container').empty();
    if (card) {
        var front = card_generate_front(card, card_options);
        var back = card_generate_back(card, card_options);
        $('#preview-container').html(front + '\n' + back);
    }
    fitty('#card-name', { minSize: 4, multiLine: true });

    local_store_save();
}

function ui_open_help() {
    $('#help-modal').modal('show');
}

function ui_open_tags() {
    $('#tags-modal').modal('show');
}

function ui_open_bb() {
    $('#bbcode-modal').modal('show');
}

function ui_select_icon() {
    // window.open('http://game-icons.net/', '_blank');
    // get function caller id jquery
    var caller = $(this).attr('id');
    $('#icon-modal').attr('data-search', caller == "front-icon-search" ?
        "card-icon" : caller == "back-icon-search" ?
        "card-icon-back" : "default-icon");

    let card = ui_selected_card();
    $('#icon-modal').attr('data-color', card.color);

    $('#icon-modal').modal('show');
    $('#icon-modal-search').val('')
    $('#icon-modal-search').focus();
}

function ui_setup_icons() {
    for (let i = 0; i < icon_names.length; i++) {
        let element = document.createElement('div');
        element.className = `icon-${icon_names[i]} grid-item`;
        element.style.display = 'none';
        element.setAttribute('name', icon_names[i]);
        element.setAttribute('data-title', icon_names[i]);
        element.onclick = function() {
            let input = $("#icon-modal").attr('data-search');
            $('#' + input).val(this.getAttribute('name')).change();
            $('#icon-modal').modal('hide');
        }
        $('#icon-modal-container').append(element);
    }

}

function ui_setup_color_selector() {
    // Insert colors
    //$('#card-color').change(function(e) {
    //    $('#card-color-rgb').val($('#card-color').val());
    //    $('#card-color-rgb').trigger('change');
    //});

    $("#car-color-front").click(function(event) {
        $("#card-color-rgb").click();
    });

    $('#card-color-rgb').on('input', function(e) {
        $('#card-color').val($('#card-color-rgb').val());
        $('#card-color').trigger('change');
        $('#car-color-front').css('background-color', $('#card-color-rgb').val());
    });

    const length = 100 / Object.entries(default_color_palette).length
    for (const [key, value] of Object.entries(default_color_palette)) {
        //<button data-bs-toggle="tooltip" data-bs-placement="top" value="008000" title="Uncommon" type="button" class="btn btn-sm btn-default palette-btn" />
        let button = `<button data-bs-toggle="tooltip" 
            data-bs-placement="top" value="${value}"
            style="width: calc(${length}% - 2px)"
            title="${key}" type="button" 
            class="btn btn-sm btn-default palette-btn" 
        />`
        $("#color-palette").append(button);
    }
}

function ui_set_default_color(color) {
    //card_options.default_color = color;
    //ui_render_selected_card();
}

function ui_set_foreground_color(color) {
    card_options.foreground_color = color;
}

function ui_set_background_color(color) {
    card_options.background_color = color;
}

function ui_change_option() {
    var property = $(this).attr('data-option');
    var value;
    if ($(this).attr('type') === 'checkbox') {
        value = $(this).is(':checked');
    } else {
        value = $(this).val();
    }
    card_options[property] = value;
    ui_render_selected_card();
}

function ui_change_card_title() {
    var title = $('#card-title').val();
    var card = ui_selected_card();
    if (card) {
        card.title = title;
        $('#selected-card option:selected').text(title);
        document.querySelector('#selected-card').fstdropdown.setTitle(title);
        ui_render_selected_card();
    }
}

function ui_change_card_property() {
    var property = $(this).attr('data-property');
    var value = $(this).val();
    var card = ui_selected_card();
    if (card) {
        card[property] = value;
        ui_render_selected_card();
    }
}

function ui_set_card_color(value) {
    var card = ui_selected_card();
    if (card) {
        card.color = value;
        ui_render_selected_card();
    }
}

function ui_update_card_color_selector(color, input, selector) {
    $(selector).val(color)
}

function ui_change_card_color() {
    var input = $(this);
    var color = input.val();

    if (color[0] != '#') {
        color = sanitizeColor(color);

        if (color[0] == null) {
            console.warn('Color not found', color);
            color = '#000000';
        }
    }

    $(this).val(color);

    var rgbColor = hex2rgb(color);


    var customColor = `${rgbColor.r} ${rgbColor.g} ${rgbColor.b}`


    // change the var --card-color to color found in :root
    document.documentElement.style.setProperty('--card-color', customColor);

    ui_update_card_color_selector(color, input, '#card-color-rgb');
    ui_set_card_color(color);
}

function ui_change_default_color() {
    var input = $(this);
    var color = input.val();

    ui_update_card_color_selector(color, input, '#default_color_selector');
    ui_set_default_color(color);
}

function ui_change_default_icon() {
    var value = $(this).val();
    card_options.default_icon = value;
    ui_render_selected_card();
}

function ui_change_card_contents() {
    var value = $(this).val();

    var card = ui_selected_card();
    if (card) {
        card.contents = value.split('\n');
        ui_render_selected_card();
    }
}

function ui_change_card_contents_keyup() {
    clearTimeout(ui_change_card_contents_keyup.timeout);
    ui_change_card_contents_keyup.timeout = setTimeout(function() {
        $('#card-contents').trigger('change');
    }, 200);
}
ui_change_card_contents_keyup.timeout = null;

function ui_change_back_contents() {
    var value = $(this).val();

    var card = ui_selected_card();
    if (card) {
        card.back_contents = value.split('\n');
        ui_render_selected_card();
    }
}

function ui_change_back_contents_keyup() {
    clearTimeout(ui_change_back_contents_keyup.timeout);
    ui_change_back_contents_keyup.timeout = setTimeout(function() {
        $('#back-contents').trigger('change');
    }, 200);
}
ui_change_back_contents_keyup.timeout = null;

function ui_change_card_tags() {
    var value = $(this).val();

    var card = ui_selected_card();
    if (card) {
        if (value.trim().length === 0) {
            card.tags = [];
        } else {
            card.tags = value.split(',').map(function(val) {
                return val.trim().toLowerCase();
            });
        }
        ui_render_selected_card();
    }
}

function ui_change_default_title_size() {
    card_options.default_title_size = $(this).val();
    ui_render_selected_card();
}

function ui_change_default_icon_size() {
    card_options.icon_inline = $(this).is(':checked');
    ui_render_selected_card();
}

function ui_toggle_back_text() {
    card = ui_selected_card();
    card.background_text_toggle = $(this).is(':checked');
    if (card.background_text_toggle) $('#form-back').show();
    else $('#form-back').hide();
    ui_render_selected_card();
}

function ui_sample() {
    var sample_data = card_data_example;
    sample_data.forEach((data) => {
        ui_add_new_card_with_data(data, true);
    });
    ui_update();

    //sample_data.append({
    //	back_contents: [],
    //	color: "#696969",
    //	contents: (3) ["subtitle | Adventuring Gear", "rule", "text | 2 gp, 2 lb."],
    //	count: 1,
    //	icon: "mixed-swords",
    //	icon_back: "mixed-swords",
    //	tags: (3) ["item", "PHB", "Adventuring Gear"],
    //	title: "Abacus"
    //})
    //sample_data.append({
    //	back_contents: [],
    //	color: "maroon",
    //	contents: (3) ["subtitle | Adventuring Gear", "rule", "text | 2 gp, 2 lb."],
    //	count: 1,
    //	icon: "white-book-1",
    //	icon_back: "robe",
    //	tags: (3) ["item", "PHB", "Adventuring Gear"],
    //	title: "Abacus"
    //})
}

function ui_sort_execute() {
    $('#sort-modal').modal('hide');

    var fn_code = $('#sort-function').val();
    var fn = new Function('card_a', 'card_b', fn_code);

    card_data = card_data.sort(function(card_a, card_b) {
        var result = fn(card_a, card_b);
        return result;
    });

    ui_update_card_list();
}

function ui_filter() {
    $('#filter-modal').modal('show');
}

function ui_filter_execute() {
    $('#filter-modal').modal('hide');

    var fn_code = $('#filter-function').val();
    var fn = new Function('card', fn_code);

    card_data = card_data.filter(function(card) {
        var result = fn(card);
        if (result === undefined) return true;
        else return result;
    });

    ui_update_card_list();
}

function ui_import() {
    $('#import-modal').modal('show');
}

function ui_import_execute() {
    $('#import-modal').modal('hide');

    var json = $('#import-code').val();
    var data = JSON.parse(json);

    data = clean_data(data);

    ui_add_new_card_with_data(data);
}

function clean_data(data) {
    for (let i = 0; i < data.contents.length; i++) {
        data.contents[i] = data.contents[i].replace(/<a href=.{1,}>(.{1,})<\/a>/, '$1');
        data.contents[i] = data.contents[i].replace(/<span class=.{1,}>(.{1,})<\/span>/, '$1');
    }
    return data;
}

function ui_apply_default_color() {
    for (var i = 0; i < card_data.length; ++i) {
        card_data[i].color = card_options.default_color;
    }
    ui_render_selected_card();
}

function ui_apply_default_icon() {
    for (var i = 0; i < card_data.length; ++i) {
        card_data[i].icon = card_options.default_icon;
    }
    ui_render_selected_card();
}

function ui_apply_default_icon_back() {
    for (var i = 0; i < card_data.length; ++i) {
        card_data[i].icon_back = card_options.default_icon;
    }
    ui_render_selected_card();
}

//Adding support for local store
function local_store_save() {
    if (window.localStorage) {
        try {
            localStorage.setItem('card_data', JSON.stringify(card_data));
        } catch (e) {
            //if the local store save failed should we notify the user that the data is not being saved?
            console.log(e);
        }
    }
}

function local_store_load() {
    if (window.localStorage) {
        try {
            card_data = JSON.parse(localStorage.getItem('card_data')) || card_data;
        } catch (e) {
            //if the local store load failed should we notify the user that the data load failed?
            console.log(e);
        }
    }
}

$('#button-imgur').click(function() {
    $('#preview-container').children().first().attr('id', 'cardFront');
    $('#preview-container').children().last().attr('id', 'cardBack');
    var s = 2.5;

    $('#imgur-export').show();
    html2canvas(document.querySelector('#cardFront'), { scale: s }).then((canvas) => {
        document.body.appendChild(canvas);
        $('canvas').attr('class', 'captured');

        uploadToImgur(canvas, 'front');
    });
    html2canvas(document.querySelector('#cardBack'), { scale: s }).then((canvas) => {
        //canvas = canvas.setAttribute("class", "omegalul");
        document.body.appendChild(canvas);
        $('canvas').attr('class', 'captured');

        uploadToImgur(canvas, 'back');
    });
});

$('#copyFront').click(function() {
    var copyText = document.getElementById('imgur-front');
    copyText.select();
    document.execCommand('copy');
});

$('#copyBack').click(function() {
    var copyText = document.getElementById('imgur-back');
    copyText.select();
    document.execCommand('copy');
});

$('#copyAll').click(function() {
    $("#copyArea").show();
    var front = $('#imgur-front').val();
    var back = $('#imgur-back').val();
    var color = $('#card-color').val();
    var tc = sanitizeColor(color.toLowerCase());

    if (!tc) tc = "-w"


    let oldText = $('#clipboardManipulator').text()
    $('#clipboardManipulator').text(tc + " " + front + " " + back);
    if (oldText.length > 0) $('#clipboardManipulator').text($('#clipboardManipulator').text() + "\n" + oldText)
    let lines = $('#clipboardManipulator').val().split('\n').length
    if (lines > 3) {
        $("#clipboardManipulator").attr("rows", lines);
    } else $("#clipboardManipulator").attr("rows", 4);

    $('#clipboardManipulator').select()
    document.execCommand('copy')
    document.selection.empty()
});

$("#clearAll").click(function(e) {
    e.preventDefault();
    $("#clipboardManipulator").text("")
});

function uploadToImgur(canvas, side) {
    try {
        var img = canvas.toDataURL('image/jpeg').split(',')[1];
    } catch (e) {
        var img = canvas.toDataURL().split(',')[1];
    }
    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'post',
        headers: {
            Authorization: 'Client-ID f71d1c5e1627800'
        },
        data: {
            image: img
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                //window.location = response.data.link;
                console.log(response);
                $('#imgur-' + side).val(response.data.link).change();
            }
        }
    });

    canvas.remove();
}

function sanitizeColor(color) {
    if (color[0] == '#') return color;
    else {
        var colors = {
            aliceblue: '#f0f8ff',
            antiquewhite: '#faebd7',
            aqua: '#00ffff',
            aquamarine: '#7fffd4',
            azure: '#f0ffff',
            beige: '#f5f5dc',
            bisque: '#ffe4c4',
            black: '#000000',
            blanchedalmond: '#ffebcd',
            blue: '#0000ff',
            blueviolet: '#8a2be2',
            brown: '#a52a2a',
            burlywood: '#deb887',
            cadetblue: '#5f9ea0',
            chartreuse: '#7fff00',
            chocolate: '#d2691e',
            coral: '#ff7f50',
            cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc',
            crimson: '#dc143c',
            cyan: '#00ffff',
            darkblue: '#00008b',
            darkcyan: '#008b8b',
            darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9',
            darkgreen: '#006400',
            darkkhaki: '#bdb76b',
            darkmagenta: '#8b008b',
            darkolivegreen: '#556b2f',
            darkorange: '#ff8c00',
            darkorchid: '#9932cc',
            darkred: '#8b0000',
            darksalmon: '#e9967a',
            darkseagreen: '#8fbc8f',
            darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f',
            darkturquoise: '#00ced1',
            darkviolet: '#9400d3',
            deeppink: '#ff1493',
            deepskyblue: '#00bfff',
            dimgray: '#696969',
            dodgerblue: '#1e90ff',
            firebrick: '#b22222',
            floralwhite: '#fffaf0',
            forestgreen: '#228b22',
            fuchsia: '#ff00ff',
            gainsboro: '#dcdcdc',
            ghostwhite: '#f8f8ff',
            gold: '#ffd700',
            goldenrod: '#daa520',
            gray: '#808080',
            green: '#008000',
            greenyellow: '#adff2f',
            honeydew: '#f0fff0',
            hotpink: '#ff69b4',
            indianred: '#cd5c5c',
            indigo: '#4b0082',
            ivory: '#fffff0',
            khaki: '#f0e68c',
            lavender: '#e6e6fa',
            lavenderblush: '#fff0f5',
            lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd',
            lightblue: '#add8e6',
            lightcoral: '#f08080',
            lightcyan: '#e0ffff',
            lightgoldenrodyellow: '#fafad2',
            lightgrey: '#d3d3d3',
            lightgreen: '#90ee90',
            lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a',
            lightseagreen: '#20b2aa',
            lightskyblue: '#87cefa',
            lightslategray: '#778899',
            lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0',
            lime: '#00ff00',
            limegreen: '#32cd32',
            linen: '#faf0e6',
            magenta: '#ff00ff',
            maroon: '#800000',
            mediumaquamarine: '#66cdaa',
            mediumblue: '#0000cd',
            mediumorchid: '#ba55d3',
            mediumpurple: '#9370d8',
            mediumseagreen: '#3cb371',
            mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a',
            mediumturquoise: '#48d1cc',
            mediumvioletred: '#c71585',
            midnightblue: '#191970',
            mintcream: '#f5fffa',
            mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5',
            navajowhite: '#ffdead',
            navy: '#000080',
            oldlace: '#fdf5e6',
            olive: '#808000',
            olivedrab: '#6b8e23',
            orange: '#ffa500',
            orangered: '#ff4500',
            orchid: '#da70d6',
            palegoldenrod: '#eee8aa',
            palegreen: '#98fb98',
            paleturquoise: '#afeeee',
            palevioletred: '#d87093',
            papayawhip: '#ffefd5',
            peachpuff: '#ffdab9',
            peru: '#cd853f',
            pink: '#ffc0cb',
            plum: '#dda0dd',
            powderblue: '#b0e0e6',
            purple: '#800080',
            rebeccapurple: '#663399',
            red: '#ff0000',
            rosybrown: '#bc8f8f',
            royalblue: '#4169e1',
            saddlebrown: '#8b4513',
            salmon: '#fa8072',
            sandybrown: '#f4a460',
            seagreen: '#2e8b57',
            seashell: '#fff5ee',
            sienna: '#a0522d',
            silver: '#c0c0c0',
            skyblue: '#87ceeb',
            slateblue: '#6a5acd',
            slategray: '#708090',
            snow: '#fffafa',
            springgreen: '#00ff7f',
            steelblue: '#4682b4',
            tan: '#d2b48c',
            teal: '#008080',
            thistle: '#d8bfd8',
            tomato: '#ff6347',
            turquoise: '#40e0d0',
            violet: '#ee82ee',
            wheat: '#f5deb3',
            white: '#ffffff',
            whitesmoke: '#f5f5f5',
            yellow: '#ffff00',
            yellowgreen: '#9acd32'
        };
        if (colors[color]) return colors[color];
        else return null;
    }
}

$(document).ready(function() {
    local_store_load();
    ui_setup_color_selector();
    ui_setup_icons();

    $(window).scroll(function() {
        const default_margin = 10

        let val = $(window).scrollTop() + default_margin
        if (val <= 500)
            $("#preview-container").stop().animate({ "marginTop": val + "px" }, 50);
    });

    $('.icon-list').typeahead({
        source: icon_names,
        items: 'all',
        render: function(items) {
            var that = this;

            items = $(items).map(function(i, item) {
                i = $(that.options.item).data('value', item);
                i.find('a').html(that.highlighter(item));
                var classname = 'icon-' + item.split(' ').join('-').toLowerCase();
                i.find('a').append('<span class="' + classname + '"></span>');
                return i[0];
            });

            if (this.autoSelect) {
                items.first().addClass('active');
            }
            this.$menu.html(items);
            return this;
        }
    });

    $('#button-generate').click(ui_generate);
    $('#button-load').click(function() {
        $('#file-load').click();
    });
    $('#file-load').change(ui_load_files);
    $('#button-clear').click(ui_clear_all);
    //$("#button-load-sample").click(ui_load_sample);
    //$("#button-save").click(ui_save_file);
    $('#button-sample').click(ui_sample);
    $('#button-filter').click(ui_filter);
    $('#button-add-card').click(ui_add_new_card);
    $('#button-duplicate-card').click(ui_duplicate_card);
    $('#btn-import-card').click(ui_import);
    $('#button-delete-card').click(ui_delete_card);
    $('#button-help').click(ui_open_help);
    //$('#button-apply-color').click(ui_apply_default_color);
    $('#button-apply-icon').click(ui_apply_default_icon);
    $('#button-apply-icon-back').click(ui_apply_default_icon_back);
    $('#button-to-last').click(ui_update);

    //document.querySelector('#selected-card').setFstDropdown();
    $('#selected-card').change(ui_update_selected_card);

    $('#card-title').change(ui_change_card_title);
    $('#card-title-size').change(ui_change_card_property);
    $('#card-icon').change(ui_change_card_property);
    $('#card-count').change(ui_change_card_property);
    $('#card-icon-back').change(ui_change_card_property);
    $('#card-background').change(ui_change_card_property);
    $('#card-color').change(ui_change_card_color);
    $('#card-contents').change(ui_change_card_contents);
    $('#card-tags').change(ui_change_card_tags);

    $('#card-contents').keyup(ui_change_card_contents_keyup);

    $('#page-size').change(ui_change_option);
    $('#page-rows').change(ui_change_option);
    $('#page-columns').change(ui_change_option);
    $('#card-arrangement').change(ui_change_option);
    $('#card-size').change(ui_change_option);
    $('#background-color').change(ui_change_option);
    $('#rounded-corners').change(ui_change_option);

    //$('#default-color').change(ui_change_default_color);
    $('#default-icon').change(ui_change_default_icon);
    $('#default-title-size').change(ui_change_default_title_size);
    $('#small-icons').change(ui_change_default_icon_size);

    $('.icon-select-button').click(ui_select_icon);

    $('#sort-execute').click(ui_sort_execute);
    $('#filter-execute').click(ui_filter_execute);
    $('#import-execute').click(ui_import_execute);

    $('#back-text').change(ui_toggle_back_text);

    $('#back-contents').change(ui_change_back_contents);
    $('#back-contents').keyup(ui_change_back_contents_keyup);

    $('#imgur-export').hide();
    $('#imgur-front').change(function() {
        $(this).addClass('highlighted');
        setTimeout(() => {
            $(this).removeClass('highlighted');
        }, 2750);
    });
    $('#imgur-back').change(function() {
        $(this).addClass('highlighted');
        setTimeout(() => {
            $(this).removeClass('highlighted');
        }, 2750);
    });

    $('#form-back').hide();

    $('#button-tags').click(ui_open_tags);

    $('#button-bbcode').click(ui_open_bb);


    $('#color-palette button').each(function(index) {
        let hex = "#" + $(this).val()
        $(this).css("background-color", hex);
    })

    $('#color-palette button').click(function() {

        let color = rgb2hex($(this).css('background-color'));

        $('#card-color').val(color).change();

        let palettes = []
        let quality = $(this).attr("data-bs-original-title");
        $('#color-palette button').each(function() {
            palettes.push($(this).attr('data-bs-original-title'))
        })
        palettes = palettes.join("|")

        let content = $('#card-contents').val();
        let regex = RegExp("^subtitle \\| (" + palettes + ").{0,}$", "gm");
        let grp = regex.exec(content);
        if (grp) {
            content = content.replace(grp[1], quality);
            $('#card-contents').val(content).change();
        } else {
            $('#card-contents').val(`subtitle | ${quality}\nrule\n${content}`).change();
        }
    });

    ui_update_card_list();

    $.each(Object.keys(card_element_generators), function() {
        $('#tag-selector').append($('<option />').val(this).text(card_element_generators_translator[this]));
    });
    $("#tag-selector-fs-support").hide();

    bbcodeParser.bbCodes.forEach((bbcode) => {
        $('#bbcode-selector').append($('<option />').val(bbcode.code).text(bbcode.pattern));
    });

    $.each(Object.keys(card_element_generators), function() {
        if (tagEnabled(this)) {
            $item = $('<li class="dropdown-item" href="#" value="' + this + '" />').text(
                card_element_generators_translator[this]
            );
            $('#front-tag-maker').append($item);
        }
    });
    $.each(Object.keys(card_element_generators), function() {
        if (tagEnabled(this)) {
            $item = $('<li class="dropdown-item" href="#" value="' + this + '" />').text(
                card_element_generators_translator[this]
            );
            $('#back-tag-maker').append($item);
        }
    });
    $('.dropdown-item').click(function(event) {
        event.preventDefault();
        let selected = $(this).attr('value');
        let code = preCode(selected, true);
        let parent = $(this).parent().attr('id');

        let element = '';
        if (parent == 'front-tag-maker') {
            element = 'card-contents';
        } else if (parent == 'back-tag-maker') {
            element = 'back-contents';
        } else return;
        let current = $('#' + element).val();
        $('#' + element).val(current + '\n' + code).change();
        $('#' + element).focus();
        $('#' + element).setSelectionRange(current.length + 1);
    });

    $('#bold-front').click(function() {
        bbcoder('B', checker('front'));
    });
    $('#italic-front').click(function() {
        bbcoder('I', checker('front'));
    });
    $('#underline-front').click(function() {
        bbcoder('U', checker('front'));
    });

    $('#bold-back').click(function() {
        bbcoder('B', checker('back'));
    });
    $('#italic-back').click(function() {
        bbcoder('I', checker('back'));
    });
    $('#underline-back').click(function() {
        bbcoder('U', checker('back'));
    });

    $('#card-contents').mouseup(function() {
        checkButtons(checker('front'));
        //checkButtons('front');
        //checkTag("front");
    });
    $('#back-contents').mouseup(function() {
        checkButtons(checker('back'));
        //checkButtons('back');
        //checkTag("back");
    });

    $('#tag-selector').change(function() {
        var tag = $('option:selected', this).val();
        $('#tag-selector-explanation').html(card_elemement_generators_expanation[tag]);
        if (tag == "text" || tag == "center" || tag == "justify" || tag == "action") {
            $('#tag-selector-fs-support').show();
        } else {
            $('#tag-selector-fs-support').hide();
        }

    });
    $('#bbcode-selector').change(function() {
        var tag = $('option:selected', this).val();
        $('#bbcode-selector-explanation').html(getBBCodeExplanation(tag));
    });

    $('#mkweapon-front').click(function() {
        let quality = colorTranslator($('#card-color').val());
        let txt =
            `subtitle | ${quality} Weapon Type (Attunement)\n` +
            'rule\n' +
            'property | Damage | damage\n' +
            'property | Modifier | mod\n' +
            'property | Properties | props\n' +
            'rule\n';
        let curr = $('#card-contents').val();
        $('#card-contents').val(curr.length > 0 ? `${curr}\n${txt}` : txt).change();
    });
    $('#mkweapon-back').click(function() {
        let quality = colorTranslator($('#card-color').val());
        let txt =
            `subtitle | ${quality} Weapon Type (Attunement)\n` +
            'rule\n' +
            'property | Damage | damage\n' +
            'property | Modifier | mod\n' +
            'property | Properties | props\n' +
            'rule\n';
        let curr = $('#back-contents').val();
        $('#back-contents').val(curr.length > 0 ? `${curr}\n${txt}` : txt).change();
    });

    $('#icon-modal-search').keyup(function() {
        let search = $(this).val();
        if (search.length >= 2) {
            $('#icon-modal-container').children().each(function() {
                let name = $(this).attr('name');
                if (name.toLowerCase().includes(search.toLowerCase())) {
                    $(this).css('display', 'block');
                    $(this).css('background-color', $('#icon-modal').attr('data-color'))

                } else {
                    $(this).css('display', 'none');
                }
            });
        } else {
            $('#icon-modal-container').children().each(function() {
                $(this).css('display', 'none');
            });
        }
    });

    $("#copyArea").hide();

    setupShortcuts()

    // setting up tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

function setupShortcuts() {
    const shortcuts = {
        // Deck movement shortcuts
        'up': {
            func: (e) => {
                if (!$(':focus').hasClass('form-control')) {
                    e.preventDefault();
                    document.querySelector('#selected-card').fstdropdown.previous()
                }
            },
            desc: "Select the previous card in the deck."
        },
        'down': {
            func: (e) => {
                if (!$(':focus').hasClass('form-control')) {
                    e.preventDefault();
                    document.querySelector('#selected-card').fstdropdown.next()
                }
            },
            desc: "Select the next card in the deck."
        },
        'pagedown': {
            func: (e) => {
                e.preventDefault();
                $('#button-to-last').trigger('click');
            },
            desc: "Select last card of the deck."
        },

        // Deck management shortcuts
        'ctrl+s': {
            func: (e) => {
                e.preventDefault();
                $('#button-save').trigger('click');
            },
            desc: "Save the deck into a json file."
        },
        'ctrl+r': {
            func: (e) => {
                e.preventDefault();
                $('#button-add-card').trigger('click');
            },
            desc: "Create a new card."
        },

        // Card management shortcuts
        'ctrl+e': {
            func: (e) => {
                e.preventDefault();
                $('#button-imgur').trigger('click');
            },
            desc: "Export the selected card in imgur."
        },
        'ctrl+b': {
            func: (e) => {
                e.preventDefault();
                let active = document.activeElement.id;
                if (active == 'card-contents' || active == 'back-contents')
                    bbcoder('B', checker(active == 'card-contents' ? 'front' : 'back'));
            },
            desc: "<span class='fw-bold'>Bold</span> the selected text in the card description (BBCode)."
        },
        'ctrl+i': {
            func: (e) => {
                e.preventDefault();
                let active = document.activeElement.id;
                if (active == 'card-contents' || active == 'back-contents')
                    bbcoder('I', checker(active == 'card-contents' ? 'front' : 'back'));
            },
            desc: "Make the selected text in the card description <span class='fst-italic>italic</span> (BBCode)."
        },
        'ctrl+u': {
            func: (e) => {
                e.preventDefault();
                let active = document.activeElement.id;
                if (active == 'card-contents' || active == 'back-contents')
                    bbcoder('U', checker(active == 'card-contents' ? 'front' : 'back'));
            },
            desc: "<span class='text-decoration-underline'>Underline</span> the selected text in the card description (BBCode)."
        },
        'f1': {
            func: (e) => {
                e.preventDefault();
                $('#button-help').trigger('click');
            },
            desc: "Open this dialog."
        }
    }

    $('#card-contents').addClass('mousetrap')
    $('#back-contents').addClass('mousetrap')
    for (let key in shortcuts) {
        Mousetrap.bind(key, shortcuts[key].func)
        let li = document.createElement('li')
        li.innerHTML = `<span class="shortcut-code">${key == 'f1' ? key.toUpperCase() : key}</span> - ${shortcuts[key].desc}`
        document.querySelector('#help-modal-keybinds').appendChild(li)
    }
}

function getBBCodeExplanation(tag) {
    let a = bbcodeParser.bbCodes;

    let returner = null;
    let i = 0;
    while (!returner && i <= a.length) {
        if (a[i].code == tag) returner = a[i].explanation;
        i++;
    }
    return returner;
}

function checker(side) {
    var element = side == 'front' ? 'card-contents' : 'back-contents';
    var bold = 'bold-' + side;
    var italic = 'italic-' + side;
    var underline = 'underline-' + side;
    return {
        element: $('#' + element),
        bold: $('#' + bold),
        italic: $('#' + italic),
        underline: $('#' + underline)
    };
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex2rgb(hex) {
    hex = sanitizeColor(hex);

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function calculateHighContrast(color) {
    let r = 24
    let g = 26
    let b = 27
    let brightness = 1

    var ir = Math.floor((255 - r) * brightness);
    var ig = Math.floor((255 - g) * brightness);
    var ib = Math.floor((255 - b) * brightness);
    return 'rgb(' + ir + ',' + ig + ',' + ib + ')'
}