import ident from '../tokens/ident.js';
import readExpression from './readExpression.js';

// TODO this is messy...

export default function readFunction ( parser ) {
	const start = parser.index;

	if ( !parser.read( /^[a-z\-]+\(/i ) ) return;

	if ( !readExpression( parser ) ) return;
	parser.advance();

	while ( !parser.match( ')' ) ) {
		if ( parser.eat( ',' ) ) {
			parser.advance();
		}
		
		readExpression( parser );
		parser.advance();
	}

	parser.eat( ')', true );
	const end = parser.index;

	return {
		type: 'Function',
		start,
		end,
		value: parser.css.slice( start, end )
	};
}