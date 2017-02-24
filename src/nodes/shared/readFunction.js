// TODO this is messy, and possibly incorrect (can function parameters
// contain parenthesized expressions?)...

export default function readFunction ( parser ) {
	const start = parser.index;

	if ( !parser.read( /^[a-z0-9\-]+\(/i ) ) return;

	parser.readUntil( /\)/ );

	parser.eat( ')', true );
	const end = parser.index;

	return {
		type: 'Function',
		start,
		end,
		value: parser.css.slice( start, end )
	};
}