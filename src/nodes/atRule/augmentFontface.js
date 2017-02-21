import readString from '../shared/readString.js';
import readIdentifier from '../shared/readIdentifier.js';
import * as patterns from '../../patterns.js';

export default function augmentFontface ( rule, parser ) {
	parser.advance();
	parser.eat( '{', true );
	parser.advance();

	rule.body = [];

	while ( !parser.match( '}' ) ) {
		const declaration = readFontfaceDeclaration( parser );

		if ( declaration ) {
			rule.body.push( declaration );
		} else {
			parser.error( 'Expected a font-face declaration' );
		}

		if ( parser.eat( ';' ) ) {
			parser.advance();
		} else {
			break;
		}
	}

	parser.advance();
	parser.eat( '}', true );

	rule.end = parser.index;
}

const validDescriptors = {
	'font-family': parser => {
		return readString( parser ) || readIdentifier( parser );
	},

	src: parser => {
		// TODO do this properly https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
		const start = parser.index;
		const data = parser.readUntil( /;/ );

		if ( !data ) return;

		return {
			type: 'FontSrc',
			start,
			end: parser.index,
			data
		};
	},

	'font-variant': parser => {
		// TODO do this properly https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant
		const start = parser.index;
		const data = parser.readUntil( /;/ );

		if ( !data ) return;

		return {
			type: 'FontVariant',
			start,
			end: parser.index,
			data
		};
	},

	'font-stretch': parser => {
		const start = parser.index;
		const data = parser.read( patterns.universalKeywords ) || parser.read( /(?:normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded)/i );

		if ( !data ) return;

		return {
			type: 'FontStretch',
			start,
			end: parser.index,
			data
		};
	},

	'font-style': parser => {
		const start = parser.index;
		const data = parser.read( patterns.universalKeywords ) || parser.read( /(?:normal|italic|oblique)/i );

		if ( !data ) return;

		return {
			type: 'FontStyle',
			start,
			end: parser.index,
			data
		};
	},

	'font-weight': parser => {
		const start = parser.index;
		const data = parser.read( patterns.universalKeywords ) || parser.read( /(?:normal|bold|lighter|bolder|[1-9]00)/i );

		if ( !data ) return;

		return {
			type: 'FontWeight',
			start,
			end: parser.index,
			data
		};
	},

	'unicode-range': parser => {
		// TODO do this properly https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
		const start = parser.index;
		const data = parser.readUntil( /;/ );

		if ( !data ) return;

		return {
			type: 'UnicodeRange',
			start,
			end: parser.index,
			data
		};
	}
};

const pattern = new RegExp( `^(?:${Object.keys( validDescriptors ).join( '|' )})` );

function readFontfaceDeclaration ( parser ) {
	const start = parser.index;

	const key = parser.read( pattern );
	if ( !key ) parser.error( `Expected a valid font-face descriptor` );
	parser.advance();

	parser.eat( ':', true );
	parser.advance();

	const reader = validDescriptors[ key ];
	const value = reader( parser );

	if ( !value ) parser.error( `Expected a valid value` );

	return {
		type: 'FontfaceDeclaration',
		start,
		end: parser.index,
		key,
		value
	};
}