var css_color_names = [
    "Black",
    "Navy",
    "DarkBlue",
    "MediumBlue",
    "Blue",
    "DarkGreen",
    "Green",
    "Teal",
    "DarkCyan",
    "DeepSkyBlue",
    "DarkTurquoise",
    "MediumSpringGreen",
    "Lime",
    "SpringGreen",
    "Aqua",
    "Cyan",
    "MidnightBlue",
    "DodgerBlue",
    "LightSeaGreen",
    "ForestGreen",
    "SeaGreen",
    "DarkSlateGray",
    "LimeGreen",
    "MediumSeaGreen",
    "Turquoise",
    "RoyalBlue",
    "SteelBlue",
    "DarkSlateBlue",
    "MediumTurquoise",
    "Indigo",
    "DarkOliveGreen",
    "CadetBlue",
    "CornflowerBlue",
    "MediumAquaMarine",
    "DimGray",
    "SlateBlue",
    "OliveDrab",
    "SlateGray",
    "LightSlateGray",
    "MediumSlateBlue",
    "LawnGreen",
    "Chartreuse",
    "Aquamarine",
    "Maroon",
    "Purple",
    "Olive",
    "Gray",
    "SkyBlue",
    "LightSkyBlue",
    "BlueViolet",
    "DarkRed",
    "DarkMagenta",
    "SaddleBrown",
    "DarkSeaGreen",
    "LightGreen",
    "MediumPurple",
    "DarkViolet",
    "PaleGreen",
    "DarkOrchid",
    "YellowGreen",
    "Sienna",
    "Brown",
    "DarkGray",
    "LightBlue",
    "GreenYellow",
    "PaleTurquoise",
    "LightSteelBlue",
    "PowderBlue",
    "FireBrick",
    "DarkGoldenRod",
    "MediumOrchid",
    "RosyBrown",
    "DarkKhaki",
    "Silver",
    "MediumVioletRed",
    "IndianRed",
    "Peru",
    "Chocolate",
    "Tan",
    "LightGray",
    "Thistle",
    "Orchid",
    "GoldenRod",
    "PaleVioletRed",
    "Crimson",
    "Gainsboro",
    "Plum",
    "BurlyWood",
    "LightCyan",
    "Lavender",
    "DarkSalmon",
    "Violet",
    "PaleGoldenRod",
    "LightCoral",
    "Khaki",
    "AliceBlue",
    "HoneyDew",
    "Azure",
    "SandyBrown",
    "Wheat",
    "Beige",
    "WhiteSmoke",
    "MintCream",
    "GhostWhite",
    "Salmon",
    "AntiqueWhite",
    "Linen",
    "LightGoldenRodYellow",
    "OldLace",
    "Red",
    "Fuchsia",
    "Magenta",
    "DeepPink",
    "OrangeRed",
    "Tomato",
    "HotPink",
    "Coral",
    "DarkOrange",
    "LightSalmon",
    "Orange",
    "LightPink",
    "Pink",
    "Gold",
    "PeachPuff",
    "NavajoWhite",
    "Moccasin",
    "Bisque",
    "MistyRose",
    "BlanchedAlmond",
    "PapayaWhip",
    "LavenderBlush",
    "SeaShell",
    "Cornsilk",
    "LemonChiffon",
    "FloralWhite",
    "Snow",
    "Yellow",
    "LightYellow",
    "Ivory",
    "White"
];

var css_color_template = [
    "/* @ */",
    ".color-@ {",
    "    background-color: #;",
    "    border-color: #;",
    "}",
    ".color-@ .ruler {",
    "    background-color: #;",
    "}",
    ".color-@ h3{",
    "    border-color: #;",
    "    color: #;",
    "}",
    ".color-@ .card-back {",
    "    background: radial-gradient(ellipse at center, white 20%, # 120%);",
    "}",
    ".color-@ .back-icon {",
    "    background-color: #;",
    "}",
    ""
];

var css_custom_colors = [
    "arcane #bb3d2f",
    "cleric #ae7b00",
    "rogue #802161",
    "weapon dimgray",
    "armor dimgray",
    "gear dimgray",
];

function css_color_str(name, color) {
    return css_color_template.map(function (value) {
        return value.replace("@", name).replace("#", color);
    }).join("\n");
}

function css_add_color(str) {
    var node = document.createElement('style');
    document.body.appendChild(node);
    node.innerHTML = str;
}

function css_add_colors(arr) {
    var result = arr.map(function (value) {
        var parts = value.split(" ");
        var color_name = parts[0].toLowerCase();
        var color_value = parts[1] || color_name;
        return css_color_str(color_name, color_value);
    });

    result.forEach(function (value) {
        css_add_color(value);
    });

    console.log(result.join("\n"));
}

css_add_colors(css_color_names);
css_add_colors(css_custom_colors);