import string from '../tokens/string.js';

export default function readUri ( parser ) {
	const start = parser.index;

	if ( !parser.eat( 'url' ) ) return;

	parser.eat( '(', true );
	parser.advance();

	const value = string( parser ) || parser.readUntil( /[\)\s]/ );

	parser.advance();
	parser.eat( ')', true );

	return {
		type: 'Uri',
		start,
		end: parser.index,
		value
	};
}