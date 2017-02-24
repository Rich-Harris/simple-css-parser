import * as patterns from '../../patterns.js';

// TODO this is messy, and possibly incorrect (can function parameters
// contain parenthesized expressions?)...

const name = /^[a-z0-9\-]+\(/i;

export default function readFunction ( parser ) {
	const start = parser.index;

	if ( !parser.read( name ) ) return;

	parser.readUntil( patterns.closingParen );

	parser.eat( ')', true );
	const end = parser.index;

	return {
		type: 'Function',
		start,
		end,
		value: parser.css.slice( start, end )
	};
}