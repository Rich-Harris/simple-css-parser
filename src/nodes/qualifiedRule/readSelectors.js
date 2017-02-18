import readQualifier from './readQualifier.js';

const elementPattern = /^[a-z][a-z0-9\-]*/i;

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

	const elementName = parser.read( elementPattern );
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

	while ( qualifier = readQualifier( parser ) ) {
		qualifiers.push( qualifier );
		end = parser.index;

		parser.advance();
	}

	const selector = {
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

	const combinator = parser.read( /^(?:\+|~|>)/ ) || ' ';
	parser.advance();
	const right = readSelector( parser );

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