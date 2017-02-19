export default function readDeclarations ( parser ) {
	const declarations = [];

	let declaration;

	while ( declaration = readDeclaration( parser ) ) {
		declarations.push( declaration );

		parser.advance();
		if ( !parser.eat( ';' ) ) break;
		parser.advance();
	}

	parser.eat( '}', true );
	return declarations;
}

const propertyPattern = /^[a-z\-]+/i;

function readDeclaration ( parser ) {
	const key = readProperty( parser );

	if ( !key ) return;

	parser.advance();
	parser.eat( ':', true );
	parser.advance();

	const value = readValue( parser );

	const important = parser.match( '!important' );

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

function readValue ( parser ) {
	// TODO make this more sophisticated. maybe different readers for different properties?
	const start = parser.index;
	const data = parser.readUntil( /(?:[;\}]|!important)/ );
	const end = parser.index;

	return {
		type: 'Value',
		data,
		start,
		end
	};
}