import { whitespace } from '../../patterns.js';

const specials = '! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ ` { | } ~'.split( ' ' );
const isSpecial = {};
specials.forEach( char => {
	isSpecial[ char ] = true;
});

export default function ident ( parser ) {
	let result = '';
	let escaped = false;

	while ( parser.index < parser.css.length ) {
		const char = parser.css[ parser.index ];

		if ( whitespace.test( char ) ) {
			return result;
		}

		if ( escaped ) {
			result += char;
			escaped = false;
		} else {
			if ( char === '\\' ) {
				escaped = true;
			} else if ( isSpecial[ char ] ) {
				return result;
			} else {
				result += char;
			}
		}

		parser.index += 1;
	}
}