const quotePattern = /^["']/;

export default function string ( parser ) {
	const quote = parser.read( quotePattern );
	if ( !quote ) return;

	let result = '';
	let escaped = false;

	while ( parser.index < parser.css.length ) {
		const char = parser.css[ parser.index++ ];

		if ( escaped ) {
			result = result + char;
			escaped = false;
		} else if ( char === '\\' ) {
			escaped = true;
		} else if ( char === quote ) {
			return result;
		} else {
			result = result + char;
		}
	}

	parser.error( 'Unexpected end of string' );
}