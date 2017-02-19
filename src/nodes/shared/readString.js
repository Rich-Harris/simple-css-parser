import string from '../tokens/string.js';

export default function readString ( parser ) {
	const start = parser.index;
	const value = string( parser );

	if ( !value ) return;

	return {
		type: 'String',
		start,
		end: parser.index,
		value
	};
}