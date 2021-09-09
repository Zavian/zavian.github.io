$(document).ready(function() {
    $("#materialComponents").hide();
    $($("#material")).change(function(e) {
        e.preventDefault();
        $("#materialComponents").toggle();
    });

    $("#button-generate").click(function(e) {
        e.preventDefault();
        var spell = {};

        spell.name = $("#name").val();
        spell.level = $("#level option:selected").val();
        spell.school = $("#school option:selected").val();
        spell.classes = [];
        spell.ritual = $("#ritual:checked").length == 1
        spell.time = $("#time option:selected").val();
        spell.range = $("#range").val();
        spell.components = ""

        let arr = []
        $('input:checkbox[name=componentsA]').each(function() {
            if ($(this).is(":checked")) { arr.push($(this).val()) }
        });
        if (arr.length > 0) spell.components = arr.join(" ")
        if ("#material:checked") spell.materialComponents = $("#materialComponents").val();
        spell.duration = $("#duration option:selected").val()
        spell.concentration = $("#concentration:checked").length == 1
        spell.description = $("#description").val()


        console.log(spell)

    });
    $("#button-generate").trigger('click');
});