import readDeclaration from '../shared/readDeclaration.js';
import readDeclarations from '../shared/readDeclarations.js';

export default function augmentPage ( rule, parser ) {
	parser.advance();

	rule.selectors = [];
	let selector;

	while ( selector = readPageSelector( parser ) ) {
		rule.selectors.push( selector );
		parser.advance();

		if ( parser.eat( ',' ) ) {
			parser.advance();
		} else {
			break;
		}
	}

	parser.eat( '{', true );
	parser.depth += 1;

	parser.advance();

	rule.body = [];
	let node;

	while ( node = readDeclaration( parser ) || readMarginAtRule( parser ) ) {
		rule.body.push( node );
		parser.advance();

		if ( parser.eat( ';' ) ) { // TODO only if declaration?
			parser.advance();
		}
	}

	parser.eat( '}', true );

	parser.depth -= 1;

	rule.end = parser.index;

}

function readPageSelector ( parser ) {
	const start = parser.index;

	const value = parser.read( /^:(?:blank|first|left|right|recto|verso)/ );
	if ( !value ) return;

	return {
		type: 'PageSelector',
		start,
		end: parser.index,
		value
	};
}

function readMarginAtRule ( parser ) {
	const start = parser.index;

	const name = parser.read( /^@(?:(?:top|bottom)-(?:(?:left|right)(?:-corner)?|center)|(?:left|right)-(?:top|middle|bottom))/ );
	if ( !name ) return;

	parser.advance();
	parser.eat( '{', true );
	parser.advance();

	const body = readDeclarations( parser );

	return {
		type: 'AtRule',
		subtype: name.slice( 1 ),
		start,
		end: parser.index,
		body
	};
}

