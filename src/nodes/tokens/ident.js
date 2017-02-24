import { whitespace } from '../../patterns.js';

// https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
// tl;dr: valid identifiers include [a-zA-Z0-9_\-] plus any
// character above \u00A0 (160 — non-breaking space), plus any
// escaped character

const specials = '! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ ` { | } ~'.split( ' ' );
const isSpecial = {};
specials.forEach( char => {
	isSpecial[ char ] = true;
});

const validChars = /[a-zA-Z0-9_\-]/;

export default function ident ( parser ) {
	let result = '';
	let escaped = false;

	let char;

	while ( parser.index < parser.css.length ) {
		char = parser.css[ parser.index ];

		if ( whitespace.test( char ) ) {
			return result;
		}

		if ( escaped ) {
			result = result + char;
			escaped = false;
		} else {
			if ( char === '\\' ) {
				escaped = true;
			} else if ( validChars.test( char ) || char.charCodeAt( 0 ) >= 160 ) {
				result = result + char;
			} else {
				return result;
			}
		}

		parser.index += 1;
	}
}