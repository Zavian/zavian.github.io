if (!window.gw2emblem)
    gw2emblem = {};

gw2emblem.flags_defs = {
    "FlipBackgroundVertical": 1,
    "FlipBackgroundHorizontal": 2,
    "FlipForegroundVertical": 4,
    "FlipForegroundHorizontal": 8
};

gw2emblem.init = function(id, size, bgColor) {
    gw2emblem.paper = Raphael(id, size, size);

    // used for shadow over color
    gw2emblem.pto2_color = '#000000';
    gw2emblem.pto2_op = 0.3;

    // used for cross color transparency
    gw2emblem.pt1_op = 0.3;

    // used for emblem background
    gw2emblem.bg_op = 0.3;

    // paper background
    gw2emblem.bg_color = bgColor || '';
    gw2emblem.bg_img = 'img_bg.png';

    // config required for transformation
    gw2emblem.base_size = 256;
    gw2emblem.flip = 0; // 1 - flipV_Bg, 2 - flipH_Bg, 4 - flipV_Fg, 8 - flipH_Fg

    return gw2emblem;
};

/*
	Example:
	{
		"background_id":13,
		"foreground_id":40,
		"flags":["FlipBackgroundHorizontal"],
		"background_color_id":673,
		"foreground_primary_color_id":584,
		"foreground_secondary_color_id":146
	}
*/
gw2emblem.drawEmblemGw2 = function(gw2obj) {
    gw2emblem.setFlipsGW2(gw2obj.flags);

    var colorBg = gw2emblem.color_defs[gw2obj.background_color_id] || '#000000',
        color1 = gw2emblem.color_defs[gw2obj.foreground_secondary_color_id] || '#FFFFFF',
        color2 = gw2emblem.color_defs[gw2obj.foreground_primary_color_id] || '#FF0000';

    var defFg = gw2emblem.defs[gw2obj.foreground_id] || '',
        defBg = gw2emblem.bg_defs[gw2obj.background_id] || '';

    gw2emblem.drawEmblem(defFg, color1, color2, defBg, colorBg);
};

gw2emblem.drawEmblemGw2CustomColor = function(gw2obj, color_table) {
    /*
    	Color table example:
    	{
    		"background_color": "#54AAFF",
    		"foreground_primary_color": "#FF0000",
    		"foreground_secondary_color": "#FFFFFF"
    	}
    */
    gw2emblem.setFlipsGW2(gw2obj.flags);

    var colorBg = color_table.background_color || '#000000',
        color1 = color_table.foreground_secondary_color || '#FFFFFF',
        color2 = color_table.foreground_primary_color || '#FF0000';

    var defFg = gw2emblem.defs[gw2obj.foreground_id] || '',
        defBg = gw2emblem.bg_defs[gw2obj.background_id] || '';

    gw2emblem.drawEmblem(defFg, color1, color2, defBg, colorBg);

}

gw2emblem.drawEmblem = function(defFg, color1, color2, defBg, colorBg) {
    var paper = gw2emblem.paper;

    paper.clear();

    // set background
    if (gw2emblem.bg_color !== '')
        paper.rect(0, 0, paper.width, paper.height).attr({ 'fill': gw2emblem.bg_color, 'stroke': gw2emblem.bg_color });
    else
        paper.image(gw2emblem.bg_img, 0, 0, paper.width, paper.height);

    gw2emblem.drawEmblemBg(defBg, colorBg);
    gw2emblem.drawEmblemFg(defFg, color1, color2);
};

gw2emblem.drawEmblemFg = function(def, color1, color2) {
    var paper = gw2emblem.paper,
        i;

    var scale = paper.width / gw2emblem.base_size,
        transformStr = (scale != 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';

    if (gw2emblem.flip > 3) {
        transformStr = transformStr.concat(' s', ((gw2emblem.flip & 8) !== 0) ? -1 : 1, ',', ((gw2emblem.flip & 4) !== 0) ? -1 : 1, ',', gw2emblem.base_size / 2, ',', gw2emblem.base_size / 2);
    }

    gw2emblem.paths = [];
    var paths = gw2emblem.paths;
    if (def.p1) {
        for (i = 0; i < def.p1.length; i++)
            paths[paths.length] = paper.path(def.p1[i]).attr({ 'fill': color1, 'stroke': 'none' }).transform(transformStr);
    }

    if (def.p2) {
        for (i = 0; i < def.p2.length; i++)
            paths[paths.length] = paper.path(def.p2[i]).attr({ 'fill': color2, 'stroke': 'none' }).transform(transformStr);
    }

    if (def.pto2) {
        for (i = 0; i < def.pto2.length; i++)
            paths[paths.length] = paper.path(def.pto2[i]).attr({ 'fill': gw2emblem.pto2_color, 'stroke': 'none', 'opacity': gw2emblem.pto2_op }).transform(transformStr);
    }

    if (def.pt1) {
        for (i = 0; i < def.pt1.length; i++)
            paths[paths.length] = paper.path(def.pt1[i]).attr({ 'fill': color1, 'stroke': 'none', 'opacity': gw2emblem.pt1_op }).transform(transformStr);
    }

    return paths;
};

gw2emblem.drawEmblemBg = function(def, color) {
    var paper = gw2emblem.paper,
        i,
        opacity = def.t ? gw2emblem.bg_op : 1;

    var scale = paper.width / gw2emblem.base_size,
        transformStr = (scale != 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';

    if ((gw2emblem.flip & 1) !== 0 || (gw2emblem.flip & 2) !== 0) {
        transformStr = transformStr.concat(' s', ((gw2emblem.flip & 2) !== 0) ? -1 : 1, ',', ((gw2emblem.flip & 1) !== 0) ? -1 : 1, ',', gw2emblem.base_size / 2, ',', gw2emblem.base_size / 2);
    }

    gw2emblem.bg_paths = [];

    var paths = gw2emblem.bg_paths;
    if (def.p) {
        for (i = 0; i < def.p.length; i++)
            paths[paths.length] = paper.path(def.p[i]).attr({ 'fill': color, 'stroke': 'none', 'opacity': opacity }).transform(transformStr);
    }

    return paths;
};

gw2emblem.setFlipsGW2 = function(flags) {
    gw2emblem.flip = 0;

    for (var i = 0; i < flags.length; i++) {
        if (gw2emblem.flags_defs[flags[i]]) {
            gw2emblem.flip += gw2emblem.flags_defs[flags[i]];
        }
    }
};

// GW2 Color Defs
gw2emblem.color_defs = { "1": "#7c6c53", "2": "#252326", "3": "#5f5c5c", "4": "#484546", "5": "#302e31", "6": "#d3d0cf", "7": "#003349", "8": "#016a87", "9": "#004c6d", "10": "#3682a0", "11": "#001f34", "12": "#48220f", "13": "#41311d", "14": "#58402a", "15": "#27251e", "16": "#2a1607", "17": "#472c17", "18": "#361e03", "19": "#353228", "20": "#968469", "21": "#301308", "22": "#564a38", "23": "#7e6343", "24": "#653b22", "25": "#221b0b", "26": "#5f4320", "27": "#24417a", "28": "#4a71bb", "29": "#04143e", "30": "#122559", "31": "#23578b", "32": "#774b43", "33": "#864135", "34": "#5d2319", "35": "#9f6a57", "36": "#965040", "37": "#596680", "38": "#2e4153", "39": "#203a44", "40": "#2f3148", "41": "#314a48", "42": "#485f5d", "43": "#28323f", "44": "#2e525f", "45": "#283a3d", "46": "#3d5267", "47": "#461041", "48": "#5e1d64", "49": "#793581", "50": "#9d5ca4", "51": "#2d0923", "52": "#666000", "53": "#586e39", "54": "#8a8127", "55": "#1d653b", "56": "#00260e", "57": "#0e2c0b", "58": "#42865a", "59": "#0a4f27", "60": "#0f2f24", "61": "#07351a", "62": "#453b2e", "63": "#3e4130", "64": "#714910", "65": "#3f3921", "66": "#5d2e0f", "67": "#8a6732", "68": "#3e4447", "69": "#21292d", "70": "#a7998e", "71": "#370400", "72": "#464637", "73": "#491a05", "74": "#828a92", "75": "#57534c", "76": "#0e1c25", "77": "#171b28", "78": "#241620", "79": "#261702", "80": "#0f1c14", "81": "#201906", "82": "#1e1725", "83": "#250f0b", "84": "#2b1618", "85": "#241209", "86": "#0a1b1a", "87": "#1a1829", "88": "#161c0e", "89": "#323c41", "90": "#9a8372", "91": "#7c6c53", "92": "#403d46", "93": "#7c888a", "94": "#9b8e79", "96": "#4b3f39", "97": "#373f38", "98": "#746970", "99": "#5f6460", "100": "#45463e", "101": "#666455", "102": "#ba6f57", "103": "#615449", "104": "#3c3900", "105": "#455100", "106": "#5b6a00", "107": "#272400", "108": "#747f21", "109": "#a04b17", "110": "#3b0c00", "111": "#ca6b39", "112": "#983f17", "113": "#5f1700", "114": "#452863", "115": "#230f3d", "116": "#5e468c", "117": "#301a4d", "118": "#8160af", "119": "#330002", "120": "#a9484c", "121": "#c2616a", "122": "#470000", "123": "#660006", "124": "#b65a80", "125": "#751943", "126": "#a9365e", "127": "#4d0026", "128": "#2f0019", "129": "#405612", "130": "#192700", "131": "#163900", "132": "#235000", "133": "#62893c", "134": "#2d8c7f", "135": "#00514c", "136": "#003831", "137": "#006c6c", "138": "#002323", "139": "#353574", "140": "#292159", "141": "#6b6eb9", "142": "#4d5398", "143": "#151340", "144": "#7a4400", "145": "#5e3100", "146": "#895500", "147": "#9b6c00", "148": "#ab8726", "314": "#483f42", "315": "#af9f7c", "332": "#9c6a46", "333": "#927743", "334": "#827b3e", "335": "#86706b", "336": "#998b70", "337": "#765f54", "338": "#562400", "339": "#426d23", "340": "#514500", "341": "#453000", "342": "#2c1d00", "343": "#b96b6b", "344": "#bd8861", "345": "#bb9755", "346": "#959b5f", "347": "#7d9664", "348": "#68947b", "349": "#698f97", "350": "#7579a1", "351": "#8a6c99", "352": "#945648", "353": "#736751", "354": "#a37973", "355": "#8f8f71", "356": "#738083", "357": "#8d7277", "358": "#2b322e", "359": "#6d7a4a", "360": "#5e785b", "361": "#50706a", "362": "#506773", "363": "#5b5e78", "364": "#715063", "365": "#814646", "366": "#765632", "367": "#4b4422", "368": "#57291b", "369": "#5a3808", "370": "#273300", "371": "#4a3751", "372": "#302a41", "373": "#7f7363", "374": "#c55d4b", "375": "#9d3e2d", "376": "#85241a", "377": "#580800", "378": "#470000", "379": "#b4752a", "380": "#98560b", "381": "#864000", "382": "#7b3000", "383": "#624225", "384": "#4b382e", "385": "#5b5f63", "434": "#6f4326", "435": "#5a4620", "436": "#4d2121", "437": "#552f16", "438": "#383c16", "439": "#514a64", "440": "#36273f", "441": "#482a3d", "442": "#8e8a78", "443": "#bdbab9", "444": "#857a60", "445": "#8e9881", "446": "#7f7272", "447": "#a0826c", "448": "#7d8674", "449": "#777987", "450": "#4b3a2d", "451": "#2c3439", "452": "#6b5b3c", "453": "#392920", "454": "#473f33", "455": "#2f281c", "456": "#21130e", "457": "#4d3e26", "458": "#292c36", "459": "#4f3929", "460": "#807383", "461": "#74867d", "462": "#9e8b66", "463": "#4a2a2a", "464": "#342d38", "465": "#393522", "466": "#6c3e2d", "467": "#695637", "468": "#88533f", "469": "#483b1b", "470": "#2b230c", "471": "#3d2b31", "472": "#4a361a", "473": "#1a181b", "474": "#524f4f", "475": "#6b6969", "476": "#3b393c", "477": "#9d9a9a", "478": "#624c3f", "479": "#81654d", "480": "#9c7e51", "481": "#a16d55", "482": "#000000", "483": "#000008", "484": "#323b2d", "485": "#343223", "582": "#752200", "583": "#21356a", "584": "#9d8e6c", "585": "#c7a23d", "586": "#330000", "587": "#a0a8b9", "588": "#284e82", "589": "#523776", "590": "#6687c6", "591": "#e09e5c", "592": "#770000", "593": "#6b1400", "594": "#e38350", "595": "#ee9566", "596": "#d8aa86", "597": "#414f53", "598": "#b2a740", "599": "#1a4400", "600": "#a97815", "601": "#371700", "602": "#322f00", "603": "#595fa9", "604": "#411e00", "605": "#382800", "606": "#00453e", "607": "#103300", "608": "#500c00", "609": "#3a0f32", "610": "#7d7a7a", "611": "#8e8a88", "612": "#687600", "613": "#7cb286", "614": "#7895cd", "615": "#662d6c", "616": "#893203", "617": "#1c5a2d", "618": "#4d2a00", "619": "#b34d74", "620": "#a366aa", "621": "#d8b080", "622": "#ac6620", "623": "#cc8a48", "624": "#b7678b", "625": "#005f7c", "626": "#42447f", "627": "#47514b", "628": "#ccb471", "629": "#5a0000", "630": "#63a46f", "631": "#9cc4a0", "632": "#2a5c05", "633": "#b14d3b", "634": "#22788f", "635": "#75974a", "636": "#86a956", "637": "#a9c188", "638": "#499864", "639": "#43978c", "640": "#6369b5", "641": "#8e2652", "642": "#d4b254", "643": "#888266", "644": "#382f67", "645": "#6b654c", "646": "#b5bc72", "647": "#b95629", "648": "#97322c", "649": "#8fa7d3", "650": "#e7a876", "651": "#e0ae73", "652": "#dabc6b", "653": "#8ac094", "654": "#9ebc75", "655": "#b3bc5e", "656": "#efab8b", "657": "#f7aa9d", "658": "#a895c3", "659": "#cb8ca9", "660": "#83bbac", "661": "#c1b759", "662": "#9398d6", "663": "#b88dbc", "664": "#85b3c1", "665": "#d9ab95", "666": "#a94165", "667": "#884a8e", "668": "#d8aca4", "669": "#e18076", "670": "#541c54", "671": "#9b83bc", "672": "#b1a4c3", "673": "#87000a", "674": "#00405b", "675": "#3c2456", "676": "#386299", "677": "#6e3b00", "678": "#bd7294", "679": "#c99eb2", "680": "#610a35", "681": "#6bac9e", "682": "#55ad9a", "683": "#96bab1", "684": "#787dc0", "685": "#8f77b0", "686": "#642700", "687": "#736d00", "688": "#5b4e00", "689": "#297549", "690": "#97a53b", "691": "#488f9f", "692": "#496100", "693": "#c5bd70", "694": "#4b772a", "695": "#7b7600", "696": "#01776e", "697": "#9d922a", "698": "#a0252f", "699": "#f39a91", "700": "#3d70a2", "701": "#765c9d", "702": "#f79b7e", "703": "#a99c81", "704": "#005d5d", "705": "#431a00", "706": "#6b5490", "707": "#868bc9", "708": "#9da0c4", "709": "#064224", "710": "#ac7db1", "711": "#bc9dbf", "712": "#6fa2b1", "713": "#5699ae", "714": "#96b1ba", "715": "#89932a", "1053": "#e17967", "1054": "#3e4100", "1149": "#791a09", "1150": "#440000", "1151": "#601300", "1152": "#2d0000", "1153": "#550000", "1154": "#a1660c", "1155": "#c58d36", "1156": "#455139", "1157": "#3e574f", "1158": "#42485a", "1159": "#47435a", "1160": "#573e4f", "1161": "#574747", "1231": "#3c6a65", "1232": "#3d5e6f", "1233": "#597d8f", "1234": "#578984", "1235": "#2f4d4a", "1236": "#304550", "1237": "#cb8c16", "1238": "#dab44d", "1239": "#9c5915", "1240": "#8b2e12", "1241": "#423a31", "1242": "#8e8b73" };