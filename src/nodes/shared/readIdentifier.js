const pattern = /[a-z\-_][a-z\-0-9_]*/i;

export default function readIdentifier ( parser ) {
	const start = parser.index;

	const name = parser.read( pattern );
	if ( !name ) return;

	return {
		type: 'Identifier',
		start,
		end: parser.index,
		name
	};
}