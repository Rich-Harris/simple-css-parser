import readQualifier from './readQualifier.js';
import * as patterns from '../../patterns.js';

export default function readSelectors ( parser ) {
	const selectors = [];

	let selector;

	while ( selector = readSelector( parser ) ) {
		selectors.push( selector );

		parser.advance();
		if ( !parser.eat( ',' ) ) break;
		parser.advance();
	}

	if ( !selectors.length ) return;

	parser.eat( '{', true );
	return selectors;
}

function readSelector ( parser ) {
	const start = parser.index;

	const elementName = parser.read( patterns.element );
	const element = elementName ? {
		type: 'Identifier',
		name: elementName,
		start,
		end: start + elementName.length
	} : null;

	const qualifiers = [];
	let qualifier;
	let end = parser.index;

	parser.advance();

	// declared above the loop to avoid an obscure v8 deopt
	let selector;
	let combinator;
	let right;

	while ( qualifier = readQualifier( parser ) ) {
		qualifiers.push( qualifier );
		end = parser.index;

		parser.advance();
	}

	selector = {
		type: 'SimpleSelector',
		element,
		qualifiers,
		start,
		end
	};

	if ( parser.match( ',' ) || parser.match( '{' ) ) {
		return selector;
	}

	if ( !element && !qualifiers.length ) return;

	combinator = parser.read( /^(?:\+|~|>)/ ) || ' ';
	parser.advance();
	right = readSelector( parser );

	if ( !right ) {
		parser.error( 'Expected a selector' );
	}

	return {
		type: 'Selector',
		start,
		end: parser.index,
		left: selector,
		combinator,
		right
	};
}