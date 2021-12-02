$(document).ready(function() {
    $("#create *").on('input', function(e) {
        generate()
    });

    $('#count_shorthand').html('0');
    $('#shorthand').keyup(function() {
        var text_length = $('#shorthand').val().length;

        var hue = (function() {
            return 120 - text_length
        })()

        $('#count_shorthand').css('background-color', `hsl(${hue},90%, 44%)`);

        $('#count_shorthand').html(text_length);
    });

    $("#copy-text").click(function(e) {
        e.preventDefault();
        // copy contents of #result which is a div containing the text to clipboard
        copyFunction();
    });

    $('.block-tab').on('keydown', function(e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            $(this).val($(this).val() + "\t");
        }
    });


    $("#materialComponents").toggle(false)
    $("#customDuration").toggle(false);
    $("#material").click(function(e) {
        $("#materialComponents").toggle($(this).is(":checked"));
    });

    $("#customTime").toggle(false);
    $("#time").change(function(e) {
        $("#customTime").toggle($("#time-custom").is(":selected"));
    });

    $("#duration").change(function(e) {
        $("#customDuration").toggle($("#duration-custom").is(":selected"));
    });
});

function generate() {
    let returner = {}
    returner.name = $("#name").val();
    returner.level = $("#level option:selected").text();
    returner.school = $("#school option:selected").val();
    returner.ritual = $("#ritual").is(":checked");
    returner.classes = []
    returner.time = (function() {
        if ($('#time-custom').is(":selected")) {
            return $("#customTime").val();
        } else {
            return $("#time option:selected").val();
        }
    })()
    returner.range = $("#range").val();

    returner.components = (function() {
        let arr = []
        $.each($("input[name='componentsA']"), function(indexInArray, valueOfElement) {
            if ($(this).is(":checked")) arr.push($(this).val())
        });
        return arr.join(" ")
    })()
    if (returner.components.search('M') >= 0) {
        returner.materialComponents = $("#materialComponents").val();;
        if (returner.materialComponents.search("consumes") > 0) {
            returner.castingCost = ""
        }
    }
    returner.duration = (function() {
        if ($("#duration-custom").is(":selected")) {
            return $("#customDuration").val();
        } else {
            return $("#duration option:selected").val();
        }
    })()

    returner.concentration = $("#concentration").is(":checked")
    returner.source = "VCT"
    returner.page = 0
    returner.shorthand = $("#shorthand").val();
    returner.description = $('#description').val() //.replace("\n", "\\n").replace("\t", "\\t");
    returner.higher = $('#higher').val() //.replace("\n", "\\n").replace("\t", "\\t");

    $("#result").text(`"${returner.name.toLowerCase()}": ` +
        JSON.stringify(returner, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/school: "(globalStrings\.school\..{3,})"/m, 'school: $1')
        .replace(/duration: "(globalStrings\.duration.{3,})"/m, 'duration: $1')
        .replace(/time: "(globalStrings\.time.{3,})"/m, 'time: $1')
    );
}



function copyFunction() {
    const copyText = document.getElementById("result").textContent;
    var textArea = document.getElementById('copy-area')
    if (!textArea) {
        textArea = document.createElement('textarea');
        textArea.setAttribute('id', 'copy-area')
        document.body.append(textArea);
        //textArea.style.display = "none"
    }
    textArea.style.display = "block"
    textArea.textContent = copyText;
    textArea.select();
    document.execCommand("copy");
    textArea.setSelectionRange(0, 0);
    textArea.style.display = "none"
}