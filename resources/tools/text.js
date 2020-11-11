const fontList = require('font-list');
const fs = require('fs');

function isHandwrittenFont(term) {
    const fonts = [
        'battnise',
        'behind blue eyes',
        'better land',
        'chiller',
        'comic sans ms',
        'dovahkiin',
        'draconic',
        'dragonscript',
        'freestyle script',
        'fill sans mt ext condensed bold',
        'hpphumblescratch',
        'ink free',
        'inspired',
        'kallem',
        'kristi',
        'lucida handwriting',
        'mv boli',
        'modela',
        'moonshiner',
        'niqueo bold',
        'polyhedral lc bb',
        'polyhedral uc bb',
        'pristina',
        'quavo',
        'salt',
        'secret diary',
        'segoe print',
        'segoe script',
        'straighjacket bb',
        'summerfaith',
        'the girl next door',
        'handayani'
    ];

    term = term.toLowerCase();
    var found = false;
    var i = 0;
    while (!found && i <= fonts.length) {
        if (fonts[i] == term) found = true;
        i++;
    }
    return found;
}

// "main": "generator/generate.html",
fontList
    .getFonts()
    .then((fonts) => {
        var text = '';
        var js = 'function getFonts() {\n\treturn {\n';

        const fontDest = '../../generator/css/fonts.css';
        const jsDest = '../../generator/js/fonts.js';

        var lastFont = fonts[0];
        var skipped = 0;

        fonts = fonts.sort();

        fonts.forEach((font) => {
            console.log(font);
            font = font.replace(/"/g, '');
            if (isHandwrittenFont(font)) {
                let property = font.toLowerCase();
                property = property.replace(/ /g, '_');
                family = font;
                text += `.${property} { font-family: "${family}"; }\n`;
                js += `\t\t${property.replace(/-/g, '_').replace(/\./g, '')}: "${family}",\n`;
                lastFont = font.toLowerCase();
                skipped++;
            }
        });
        console.log(`Skipped ${skipped}`);
        js += '\t}\n}';
        fs.writeFile(fontDest, text, (err) => {
            console.log(err);
            return;
        });
        fs.writeFile(jsDest, js, (err) => {
            console.log(err);
            return;
        });
    })
    .catch((err) => {
        console.log(err);
    });