export default function augmentCharset ( rule, parser ) {
	if ( rule.start !== 0 ) {
		parser.error( '@charset declaration must be at the start of the stylesheet, with no preceding spaces' );
	}

	if ( !parser.eat( ' "' ) ) {
		parser.error( 'Expected exactly one space followed by a double quotemark' );
	}

	const value = parser.readUntil( /"/ );
	if ( !parser.eat( '";' ) ) {
		parser.error( 'Expected closing double quotemark followed by semicolon' );
	}

	rule.end = parser.index;

	rule.data = {
		type: 'String',
		start: rule.start + 9,
		end: rule.end,
		value
	};
}