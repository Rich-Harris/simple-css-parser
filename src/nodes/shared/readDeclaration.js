import readExpressionList from './readExpressionList.js';

const propertyPattern = /^\*?[a-z\-]+/i; // leading asterisk is an IE fix, I think
const importantPattern = /^!\s*important/i;

export default function readDeclaration ( parser ) {
	const key = readProperty( parser );

	if ( !key ) return;

	parser.advance();
	parser.eat( ':', true );
	parser.advance();

	const value = readExpressionList( parser );
	parser.advance();

	const important = !!parser.read( importantPattern );
	if ( important ) parser.advance();

	return {
		type: 'Declaration',
		start: key.start,
		end: parser.index,
		key,
		value,
		important
	};
}

function readProperty ( parser ) {
	const start = parser.index;

	const name = parser.read( propertyPattern );

	if ( !name ) return;

	return {
		type: 'Identifier',
		name,
		start,
		end: parser.index
	};
}
