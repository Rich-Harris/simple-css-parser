import readExpression from './readExpression.js';

const pattern = /^[,\/]/;

// TODO this is messy. need to have different readers for different properties
export default function readExpressionList ( parser ) {
	const start = parser.index;

	const expression = readExpression( parser );
	if ( !expression ) return;

	let end = expression.end;
	parser.advance();

	while ( !parser.match( ';' ) ) {
		if ( parser.read( pattern ) ) {
			parser.advance();
		}

		const expression = readExpression( parser );
		if ( !expression ) break;

		end = expression.end;

		parser.advance();
	}

	return {
		type: 'Expression',
		start,
		end,
		data: parser.css.slice( start, end )
	};
}