import string from '../tokens/string.js';

const pattern = /[\)\s]/;

export default function readUri ( parser ) {
	const start = parser.index;

	if ( !parser.eat( 'url(' ) ) return;

	parser.advance();

	const value = string( parser ) || parser.readUntil( pattern );

	parser.advance();
	parser.eat( ')', true );

	return {
		type: 'Uri',
		start,
		end: parser.index,
		value
	};
}