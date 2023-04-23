var _selected_bg = -1
var _selected_fg = -1

$(document).ready(function() {
    populateContainer('bg-container', defs.bg)
    populateContainer('fg-container', defs.fg)

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
        $("#offsets-modal").modal("show");
    })

    let shadowActive = true

    let calcShadow = () => {
        let h_offset = $("#shadow-h-offset-value").html()
        let v_offset = $("#shadow-v-offset-value").html()
        let blur = $("#shadow-blur-value").html()
        let opacity = $("#shadow-opacity-value").html()
        let color = hex2rgb($("#shadow-color").val());

        let r = ""
        if (shadowActive)
            r = `${h_offset}px ${v_offset}px ${blur}px ${"rgb(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")"}`
        $("#result-foreground").css("text-shadow", r)
    }

    $("#shadow-editor").click(function() {
        $("#shadow-modal").modal("show");
    })
    $("#shadow-h-offset-range").on("input", function() {
        $("#shadow-h-offset-value").html($(this).val())
        calcShadow()
    })
    $("#shadow-v-offset-range").on("input", function() {
        $("#shadow-v-offset-value").html($(this).val())
        calcShadow()
    })
    $("#shadow-blur-range").on("input", function() {
        $("#shadow-blur-value").html($(this).val())
        calcShadow()
    })
    $("#shadow-opacity-range").on("input", function() {
        $("#shadow-opacity-value").html($(this).val())
        calcShadow()
    })
    $("#shadow-color").on("input", function() {
        calcShadow()
    })

    $("#toggle-shadow").click(function() {
        shadowActive = !shadowActive
        $(this).css("opacity", shadowActive ? "100%" : "30%")
        $("#shadow-modal .modal-body input").prop("disabled", !shadowActive)
        calcShadow()
    })

    $("#shadow-reset").click(function() {
        $("#shadow-h-offset-range").val(0).trigger("input")
        $("#shadow-v-offset-range").val(0).trigger("input")
        $("#shadow-blur-range").val(0).trigger("input")
        $("#shadow-opacity-range").val(1).trigger("input")
        $("#shadow-color").val("#000000").trigger("input")
    })

    $("#rnd-shadow").click(function() {
        $("#shadow-color").val(getRandomColor()).trigger("input")
    })

    $("#editor-reset").click(function(e) {
        e.preventDefault();

        inputs = [
            "background-left-margin", "background-top-margin",
            "foreground-left-margin", "foreground-top-margin",
        ]
        for (var i = 0; i < inputs.length; i++) {
            $("#" + inputs[i]).val("0")
            $("#" + inputs[i]).trigger("change");
        }

        $("#foreground-scale-range").val(1).trigger("input")
        $("#background-scale-range").val(1).trigger("input")
        $("#hint-editor").css("opacity", 0)


    })

    $("#background-top-margin").change(function(e) {
        $("#result-bg").css("margin-top", $(this).val() + "px");
    });
    $("#background-left-margin").change(function(e) {
        $("#result-bg").css("margin-left", $(this).val() + "px");
    });

    $("#foreground-top-margin").change(function(e) {
        $("#result-fg-0").css("margin-top", $(this).val() + "px");
        $("#result-fg-1").css("margin-top", $(this).val() + "px");
    });
    $("#foreground-left-margin").change(function(e) {
        $("#result-fg-0").css("margin-left", $(this).val() + "px");
        $("#result-fg-1").css("margin-left", $(this).val() + "px");
    });

    $("#foreground-scale-range").on("input", function() {
        $("#hint-editor").css("opacity", 1);
        $("#foreground-scale-value").html($(this).val());
        $("#result-foreground").css("font-size", $(this).val() + "em")
    })
    $("#background-scale-range").on("input", function() {
        $("#hint-editor").css("opacity", 1);
        $("#background-scale-value").html($(this).val());
        $("#result-bg").css("font-size", $(this).val() + "em")
    })


    let $modal = $("#offsets-modal");
    $modal.draggable({
        handle: ".modal-header",
    });
    $modal.resizable();

    $modal = $("#shadow-modal");
    $modal.draggable({
        handle: ".modal-header",
    });
    $modal.resizable();

    $("#offsets-modal button").click(function() {
        let id = $(this).attr('id')
        if (id.includes("-") && !id.includes("flip")) {
            var op = id.substr(0, 3)
            var marg = id.substr(4, 3);
            var elem = id.substr(8);

            var input = `${elem}-${marg == "lef" ? "left" : "top"}-margin`
            var inputVal = parseInt($("#" + input).val())

            console.log(op, marg, elem)
            console.log(input)

            if (op == "add") {
                inputVal = inputVal + 1
                $("#" + input).val(inputVal)
                $("#" + input).trigger("change")
            } else if (op == "sub") {
                inputVal = inputVal - 1
                $("#" + input).val(inputVal)
                $("#" + input).trigger("change")
            }
        } else if (id.includes("flip")) {
            if (id == "flip-horizontal-background") {
                $("#result-bg").css("transform", buildTransformString({ scaleX: "flip", obj_string: "#result-bg" }))
            } else if (id == "flip-vertical-background") {
                $("#result-bg").css("transform", buildTransformString({ scaleY: "flip", obj_string: "#result-bg" }))
            } else if (id == "flip-vertical-foreground") {
                $("#result-fg-0").css("transform", buildTransformString({ scaleY: "flip", obj_string: "#result-fg-0" }))
                $("#result-fg-1").css("transform", buildTransformString({ scaleY: "flip", obj_string: "#result-fg-1" }))
            } else if (id == "flip-horizontal-foreground") {
                $("#result-fg-0").css("transform", buildTransformString({ scaleX: "flip", obj_string: "#result-fg-0" }))
                $("#result-fg-1").css("transform", buildTransformString({ scaleX: "flip", obj_string: "#result-fg-1" }))
            }
        }
    })

    $("#offsets-modal input").on("input", function() {
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

function getScaleTransform(obj_string, axis) {
    axis = axis.toUpperCase();

    var str = document.querySelector(obj_string).style.transform;

    if (str.indexOf("scale" + axis) > -1) {
        return str.slice(
            str.indexOf("scale" + axis) + 7, // "scaleX("
            str.indexOf("scale" + axis) + 8
        )
    } else {
        return "1"
    }
}

function buildTransformString(transforms) {
    // Transforms is an object with the following properties
    // scaleX = flip | undefined
    // scaleY = flip | undefined
    // obj_string
    var transform = "translate(-50%, -50%)" // default

    if (transforms.scaleX != undefined) {
        var str = getScaleTransform(transforms.obj_string, "X")
        if (str == "-") {
            transform += ` scaleX(1)`
        } else transform += " scaleX(-1)"
    } else transform += " scaleX(1)"

    if (transforms.scaleY != undefined) {
        var str = getScaleTransform(transforms.obj_string, "Y")
        if (str == "-") {
            transform += ` scaleY(1)`
        } else transform += " scaleY(-1)"
    } else transform += ` scaleY(1)`

    return transform
}

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

    var color_bg = getRandomColor();
    var color_fg_0 = getRandomColor();
    var color_fg_1 = getRandomColor();


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
    $("#fg-" + _selected_fg).removeClass('selected')
    var fgs = Object.keys(defs.fg).length
    var random_fg = Math.floor(Math.random() * fgs)
    _selected_fg = random_fg
    $("#fg-" + _selected_fg).addClass("selected")
    drawResult();
}

function getRandomColor() {
    let colors = Object.keys(defs.colors).length;
    return defs.colors[Math.floor(Math.random() * colors)]
}

function selectRandomColorBg() {
    $("#bg-color").val(getRandomColor());

    drawResult();
}

function selectRandomColorFg() {
    var color_fg_0 = getRandomColor();
    var color_fg_1 = getRandomColor();
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