import readSelectors from './readSelectors.js';
import readDeclarations from '../shared/readDeclarations.js';

export default function qualifiedRule ( parser ) {
	const start = parser.index;

	const selectors = readSelectors( parser );

	if ( !selectors ) {
		parser.error( 'Expected a selector' );
	}

	parser.advance();
	const declarations = readDeclarations( parser );

	return {
		type: 'QualifiedRule',
		start,
		end: parser.index,
		selectors,
		declarations
	};
}