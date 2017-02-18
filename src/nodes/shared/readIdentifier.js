import ident from '../tokens/ident.js';

export default function readIdentifier ( parser ) {
	const start = parser.index;

	const name = ident( parser );
	if ( !name ) return;

	return {
		type: 'Identifier',
		start,
		end: parser.index,
		name
	};
}