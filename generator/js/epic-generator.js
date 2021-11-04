$(document).ready(function() {
    $("#make-action").click(function(e) {
        e.preventDefault();
        let input = createEpicInput();
        $("#button-container").append(input);
    });

    $("#button-container").hide();
    $("#epic").click(function() {
        if ($(this).is(":checked")) {
            $("#button-container").show();
        } else {
            $("#button-container").hide();
        }
    });



    $("#data input").on("input", function() {
        generate()
    });

    $("#input").on("input", function() {
        reset();
    })

    $("#copy-text").click(function() {
        copyToClipboard($("#result").text());
    })

});

function copyToClipboard(text) {
    let dummy = document.createElement("textarea");
    document.body.appendChild(dummy);

    let jsonObject = JSON.parse(text);

    text = JSON.stringify(jsonObject, null, 0)

    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function reset() {
    removeEpicInputs();
    setResult("");
    $("#lair").prop("checked", false);
    $("#epic").prop("checked", false);

    let input = $("#input").val();
    let statblock = JSON.parse(input);
    let extra = {}



    if (statblock.extra != null) {
        extra = statblock.extra;
        if (extra.lair != null) {
            $("#lair").prop("checked", extra.lair);
        }
        if (extra.epic != null) {
            $("#epic").prop("checked", extra.epic);
            if ($("#epic").is(":checked")) {
                $("#button-container").show();
            } else {
                $("#button-container").hide();
            }
        }
        if (extra.epicBoons != null) {
            extra.epicBoons.forEach(boon => {
                if (typeof(boon) == "object") {
                    let input = createEpicInput(boon[0], boon[1]);
                    $("#button-container").append(input);
                } else {
                    let input = createEpicInput(boon);
                    $("#button-container").append(input);
                }
            });
        }
    }
    setResult(JSON.stringify(statblock, null, 4));
}

function setResult(result) {
    $("#result").text(result);
}

function removeEpicInputs() {
    $(".epic-action").remove();
}

function generate() {
    let input = $("#input").val();
    if (input === "") return;

    let statblock = JSON.parse(input);
    let extra = statblock.extra ? statblock.extra : {};
    extra.lair = $("#lair").is(":checked");
    extra.epic = $("#epic").is(":checked");
    if (extra.epic) {
        extra.epicBoons = readBoons();
    }

    statblock.extra = extra;

    setResult(JSON.stringify(statblock, null, 4));
}

function readBoons() {
    let boons = [];
    $(".epic-action").each(function() {
        let action = $(this).find("input[name='epic-action']").val();
        let tooltip = $(this).find("input[name='epic-tooltip']").val();

        if (action === "") return;

        let boon = null
        if (tooltip === "") boon = action
        else
            boon = [
                action,
                tooltip
            ]

        boons.push(boon);
    });

    return boons;
}

function createEpicInput(inputAction, inputTooltip) {
    let container = document.createElement("div");
    container.className = "col-sm-offset-3 col-sm-9 epic-action";

    let inputGroup = document.createElement("div");
    inputGroup.className = "input-group mb-3";

    let action = document.createElement("input");
    action.type = "text";
    action.className = "form-control";
    action.ariaLabel = "Action";
    action.name = "epic-action";
    action.placeholder = "Epic Action";
    action.oninput = function() { generate() };
    if (inputAction != null) action.value = inputAction;

    inputGroup.appendChild(action);

    let tooltip = document.createElement("input");
    tooltip.type = "text";
    tooltip.className = "form-control";
    tooltip.ariaLabel = "Tooltip";
    tooltip.name = "epic-tooltip";
    tooltip.placeholder = "Tooltip of action (optional)";
    tooltip.oninput = function() { generate() };
    if (inputTooltip != null) tooltip.value = inputTooltip;

    inputGroup.appendChild(tooltip);

    let span = document.createElement("span");
    span.className = "input-group-btn";

    let button = document.createElement("button");
    button.className = "btn btn-danger btn-epic";
    button.type = "button";
    button.innerHTML = "Remove";
    button.onclick = function() {
        container.remove();
        generate();
    }

    span.appendChild(button);
    inputGroup.appendChild(span);


    container.appendChild(inputGroup);


    return container;
}