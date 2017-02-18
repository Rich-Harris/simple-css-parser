export default function readString ( parser ) {
	const start = parser.index;

	const quote = parser.read( /^["']/ );
	if ( !quote ) return;

	let result = '';
	let escaped = false;

	while ( parser.index < parser.css.length ) {
		const char = parser.css[ parser.index++ ];

		if ( escaped ) {
			result += char;
			escaped = false;
		} else if ( char === '\\' ) {
			escaped = true;
		} else if ( char === quote ) {
			return {
				type: 'String',
				start,
				end: parser.index,
				value: result
			};
		} else {
			result += char;
		}
	}

	parser.error( 'Unexpected end of string' );
}