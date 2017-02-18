import readSelectors from './readSelectors.js';
import readDeclarations from './readDeclarations.js';

export default function qualifiedRule ( parser ) {
	const start = parser.index;

	const selectors = readSelectors( parser );
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