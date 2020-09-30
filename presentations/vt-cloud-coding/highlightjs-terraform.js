/*
 * highlight.js terraform syntax highlighting definition
 *
 * @see https://github.com/highlightjs/highlight.js
 *
 * :TODO:
 *
 * @package: highlightjs-terraform
 * @author:  Nikos Tsirmirakis <nikos.tsirmirakis@winopsdba.com>
 * @since:   2019-03-20
 *
 * Description: Terraform (HCL) language definition
 * Category: scripting
 */

var module = module ? module : {};     // shim for browser use

function hljsDefineTerraform(hljs) {
	var NUMBERS = {
		cN: 'number',
		b: '\\b\\d+(\\.\\d+)?',
		r: 0
	};
	var STRINGS = {
		cN: 'string',
		b: '"',
		e: '"',
		c: [{
			cN: 'variable',
			b: '\\${',
			e: '\\}',
			r: 9,
			c: [{
				cN: 'string',
				b: '"',
				e: '"'
			}, {
			cN: 'meta',
			b: '[A-Za-z_0-9]*' + '\\(',
			e: '\\)',
			c: [
				NUMBERS, {
					cN: 'string',
					b: '"',
					e: '"',
					c: [{
						cN: 'variable',
						b: '\\${',
						e: '\\}',
						c: [{
							cN: 'string',
							b: '"',
							e: '"',
							c: [{
								cN: 'variable',
								b: '\\${',
								e: '\\}'
							}]
						}, {
							cN: 'meta',
							b: '[A-Za-z_0-9]*' + '\\(',
							e: '\\)'
						}]
					}]
          		},
          	'self']
			}]
		}]
	};

return {
	aliases: ['tf', 'hcl'],
	k: {
		keyword: 'resource variable provider output locals module data terraform|10',
		literal: "false true null"
	},
	c: [
   		hljs.C('\\#', '$'),
   		NUMBERS,
		  STRINGS
	],
}
}

module.exports = function(hljs) {
    hljs.registerLanguage('terraform', hljsDefineTerraform);
};

module.exports.definer = hljsDefineTerraform;
