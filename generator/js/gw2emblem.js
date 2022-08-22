var _selected_bg = -1
var _selected_fg = -1

$(document).ready(function() {
    populateContainer('bg-container', defs.bg)
    populateContainer('fg-container', defs.fg)
        // populateContainer('fg-container', gw2emblem.defs)

    $("#bg-color").on("input", function() {
        drawResult()
    });
    $("#fg0-color").on("input", function() {
        drawResult()
    });
    $("#fg1-color").on("input", function() {
        drawResult()
    });

    $("#rnd-emblem").click(function() {
        selectRandomFg()
    })
    $("#rnd-background").click(function() {
        selectRandomBg()
    })
    $("#rnd-emblem-clr").click(function() {
        selectRandomColorFg()
    })
    $("#rnd-background-clr").click(function() {
        selectRandomColorBg()
    })

    $("#export-group button").click(function() {
        let id = $(this).attr('id')
        let size = id.replace("btn-", "")
        makeImage(size, size)
    });

    $("#editor").click(function() {
        $(".modal").modal("show");
    })



    let $modal = $("#editor-modal");
    $modal.draggable({
        handle: ".modal-header",
    });
    $modal.resizable();

    $("#editor-modal button").click(function() {
        let id = $(this).attr('id')
        if (id.includes("-")) {
            var op = id.substr(0, 3)
            var marg = id.substr(4, 3);
            var elem = id.substr(8);

            var input = `${elem}-${marg == "lef" ? "left" : "top"}-margin`
            var inputVal = parseInt($("#" + input).val())

            console.log(op, marg, elem)
            console.log(input)

            if (op == "add") {
                inputVal = inputVal + 1
                if (marg == "lef") {
                    if (elem == "background") {
                        $("#result-bg").css("margin-left", `${inputVal}px`)
                    } else {
                        $("#result-fg-0").css("margin-left", `${inputVal}px`)
                        $("#result-fg-1").css("margin-left", `${inputVal}px`)
                    }
                } else if (marg == "top") {
                    if (elem == "background") {
                        $("#result-bg").css("margin-top", `${inputVal}px`)
                    } else {
                        $("#result-fg-0").css("margin-top", `${inputVal}px`)
                        $("#result-fg-1").css("margin-top", `${inputVal}px`)
                    }
                }
                $("#" + input).val(inputVal)
            } else if (op == "sub") {
                inputVal = inputVal - 1
                if (marg == "lef") {
                    if (elem == "background") {
                        $("#result-bg").css("margin-left", `${inputVal}px`)
                    } else {
                        $("#result-fg-0").css("margin-left", `${inputVal}px`)
                        $("#result-fg-1").css("margin-left", `${inputVal}px`)
                    }
                } else if (marg == "top") {
                    if (elem == "background") {
                        $("#result-bg").css("margin-top", `${inputVal}px`)
                    } else {
                        $("#result-fg-0").css("margin-top", `${inputVal}px`)
                        $("#result-fg-1").css("margin-top", `${inputVal}px`)
                    }
                }
                $("#" + input).val(inputVal)
            }
        }
    })

    $("#editor-modal input").on("input", function() {
        var inputVal = $(this).val()

        var id = $(this).attr("id")
        if (id == "background-left-margin") {
            $("#result-bg").css("margin-left", `${inputVal}px`)
        } else if (id == "background-top-margin") {
            $("#result-bg").css("margin-top", `${inputVal}px`)
        } else if (id == "foreground-left-margin") {
            $("#result-fg-0").css("margin-left", `${inputVal}px`)
            $("#result-fg-1").css("margin-left", `${inputVal}px`)
        } else if (id == "foreground-top-margin") {
            $("#result-fg-0").css("margin-top", `${inputVal}px`)
            $("#result-fg-1").css("margin-top", `${inputVal}px`)
        }
    })

    selectRandom();

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

});

function makeImage(width = 256, height = 256) {
    let myWindow = window.open("", "_blank");
    myWindow.document.write("<p>Loading...</p>");


    $("#result-container").clone().appendTo("#offscreen-div");
    document.getElementById("offscreen-div").firstChild.id = "";
    $("offscreen-div").first().attr("id", "");
    $("#offscreen-div").css("width", width);
    $("#offscreen-div").css("height", height);
    $("#offscreen-div").css("font-size", width);


    html2canvas(document.querySelector("#offscreen-div"), {
        width: width,
        height: height,
        backgroundColor: null,
    }).then(function(canvas) {
        myWindow.document.body.firstElementChild.remove();
        myWindow.document.body.appendChild(canvas)
        myWindow.document.title = `${width}x${height}`


        $("#offscreen-div").css("width", "0px");
        $("#offscreen-div").css("height", "0px");
        $("#offscreen-div").css("font-size", "0px");
        $("#offscreen-div").empty();
    })

    // html2canvas(document.querySelector('#result-container'), {
    //     width: width,
    //     height: height,
    //     scale: 3,
    //     background_color: null,
    //     onclone: function(c) {
    //         c.querySelector('#result-container').style.fontSize = height + "px";
    //         c.querySelector('#result-fg-0').style.fontSize = height + "px";
    //         c.querySelector('#result-fg-1').style.fontSize = height + "px";
    //         c.querySelector('#result-bg').style.fontSize = height + "px";
    //         d = c
    //     }
    // }).then((canvas) => {
    //     document.body.appendChild(canvas);
    //     console.log(d)
    //     myWindow.document.body.firstElementChild.remove()
    //     myWindow.document.body.appendChild(canvas);
    //     myWindow.document.title = `${width}x${height}`;
    // });
}

function selectRandom() {
    var bgs = Object.keys(defs.bg).length
    var fgs = Object.keys(defs.fg).length
    var colors = Object.keys(defs.colors).length;

    var random_bg = Math.floor(Math.random() * bgs)
    var random_fg = Math.floor(Math.random() * fgs)

    _selected_bg = random_bg
    _selected_fg = random_fg

    $("#bg-" + _selected_bg).addClass("selected")
    $("#fg-" + _selected_fg).addClass("selected")

    var color_bg = defs.colors[Math.floor(Math.random() * colors)];
    var color_fg_0 = defs.colors[Math.floor(Math.random() * colors)];
    var color_fg_1 = defs.colors[Math.floor(Math.random() * colors)];


    setTimeout(function() {
        $("#bg-color").val(color_bg);
        $("#fg0-color").val(color_fg_0);
        $("#fg1-color").val(color_fg_1);
        drawResult();
    }, 2000);
    // drawResult();
}

function selectRandomBg() {
    $("#bg-" + _selected_bg).removeClass('selected')
    var bgs = Object.keys(defs.bg).length
    var random_bg = Math.floor(Math.random() * bgs)
    _selected_bg = random_bg
    $("#bg-" + _selected_bg).addClass("selected")
    drawResult();
}

function selectRandomFg() {
    $("#fg-" + _selected_bg).removeClass('selected')
    var fgs = Object.keys(defs.fg).length
    var random_fg = Math.floor(Math.random() * fgs)
    _selected_fg = random_fg
    $("#fg-" + _selected_fg).addClass("selected")
    drawResult();
}

function selectRandomColorBg() {
    var colors = Object.keys(defs.colors).length;
    var color_bg = defs.colors[Math.floor(Math.random() * colors)];
    $("#bg-color").val(color_bg);

    drawResult();
}

function selectRandomColorFg() {
    var colors = Object.keys(defs.colors).length;
    var color_fg_0 = defs.colors[Math.floor(Math.random() * colors)];
    var color_fg_1 = defs.colors[Math.floor(Math.random() * colors)];
    $("#fg0-color").val(color_fg_0);
    $("#fg1-color").val(color_fg_1);

    drawResult();
}



function populateContainer(id, defs) {
    console.log("Populating container with " + id)
    let container = $('#' + id)
    let def_len = Object.keys(defs).length

    console.log(def_len)

    let t = id.includes('bg') ? 'bg' : 'fg'
    for (let i = 0; i < def_len; i++) {
        let div = $('<div>')
        let span = null
        if (t == 'bg') {
            span = $('<span />').attr('class', "gw2 " + defs[i])
        } else {
            span = [
                $('<span />').attr('class', "gw2 " + defs[i][0]),
                $('<span />').attr('class', "gw2 " + defs[i][1])
            ]
        }
        div.addClass(t + '-item')
        div.attr('id', t + '-' + i)
        div.append(span)

        container.append(div)

        div.click(function() {
            if (t == 'bg') {
                if (_selected_bg != -1) {
                    $("#bg-" + _selected_bg).removeClass('selected')
                }
                _selected_bg = i
                div.addClass('selected')
            } else {
                if (_selected_fg != -1) {
                    $("#fg-" + _selected_fg).removeClass('selected')
                }
                _selected_fg = i
                console.log('selected', _selected_fg)
                div.addClass('selected')
            }
            drawResult()
        })

    }
}

function drawResult() {
    emptyDiv('result-bg')
        // initDiv('result-bg', 512)
    emptyDiv('result-fg-0')
    emptyDiv('result-fg-1')
        // initDiv('result-fg', 512)

    var bg_color = $("#bg-color").val()

    $("#result-bg").css('color', bg_color)
    $("#result-bg").addClass(defs.bg[_selected_bg]);

    var fg_color_0 = $("#fg0-color").val();
    $("#result-fg-0").css("color", fg_color_0);
    $("#result-fg-0").addClass(defs.fg[_selected_fg][0]);

    var fg_color_1 = $("#fg1-color").val();
    $("#result-fg-1").css("color", fg_color_1);
    $("#result-fg-1").addClass(defs.fg[_selected_fg][1]);

}

function initDiv(divID, size = 128) {
    gw2emblem.init(divID, size, 'transparent')
}

function emptyDiv(divID) {
    $("#" + divID).empty()
    $("#" + divID).removeAttr("class")
}