import readDeclaration from './readDeclaration.js';

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