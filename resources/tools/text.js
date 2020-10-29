const fontList = require('font-list');
const fs = require('fs');
// "main": "generator/generate.html",
fontList
	.getFonts()
	.then((fonts) => {
		var text = '';
		var js = 'function getFonts() {\n\treturn {\n';

		const fontDest = '../../generator/css/fonts.css';
		const jsDest = '../../generator/js/fonts.js';
		fonts.forEach((font) => {
			let property = font.toLowerCase();
			property = property.replace(/ /g, '_').replace(/"/g, '');
			family = font.replace(/"/g, '');
			text += `.${property} { font-family: "${family}"; }\n`;
			js += `\t\t${property.replace(/-/g, '_').replace(/\./g, '')}: "${family}",\n`;
		});
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
