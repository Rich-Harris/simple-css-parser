export default function readGarbage ( parser ) {
	const start = parser.index;

	const name = parser.readUntil( /(?:[;\}]|!important)/i );
	if ( !name ) return;

	return {
		type: 'Unknown',
		start,
		end: parser.index,
		name
	};
}