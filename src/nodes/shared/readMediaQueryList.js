import readIdentifier from '../shared/readIdentifier.js';
import * as patterns from '../../patterns.js';

export default function readMediaQueryList ( parser ) {
	const list = [];

	let query;
	while ( query = readMediaQuery( parser ) ) {
		list.push( query );
		parser.advance();

		if ( parser.eat( ',' ) ) {
			parser.advance();
		} else {
			return list;
		}
	}
}

const conditions = /^(?:only|not)/i;
const mediaTypes = /^(?:all|print|screen|speech|tty|tv|projection|handheld|braille|embossed|aural)/i;
const and = /and/i;

function readMediaQuery ( parser ) {
	const start = parser.index;

	const condition = parser.read( conditions );
	if ( condition ) parser.advance();

	const media = parser.read( mediaTypes );
	if ( media ) parser.advance();

	if ( condition && !media ) {
		parser.error( 'Expected a valid media type' );
	}

	let expressions;

	if ( media ) {
		if ( parser.read( and ) ) {
			parser.advance();
			expressions = readMediaQueryExpressions( parser );
		} else {
			expressions = [];
		}
	} else {
		expressions = readMediaQueryExpressions( parser );
	}

	if ( !media && !expressions ) return null;

	return {
		type: 'MediaQuery',
		start,
		end: parser.index,
		not: condition ? condition.toLowerCase() === 'not' : false,
		media,
		expressions
	};
}

function readMediaQueryExpressions ( parser ) {
	const expressions = [];

	let expression;
	while ( expression = readMediaQueryExpression( parser ) ) {
		expressions.push( expression );

		parser.advance();
		if ( parser.read( /and/i ) ) {
			parser.advance();
		} else {
			return expressions;
		}
	}
}

function readMediaQueryExpression ( parser ) {
	const start = parser.index;

	if ( !parser.eat( '(' ) ) return;
	parser.advance();

	const key = readIdentifier( parser );
	parser.advance();

	let value = null;

	if ( parser.eat( ':' ) ) {
		parser.advance();
		value = readValue( parser );
		parser.advance();
	}

	parser.eat( ')', true );

	return {
		type: 'MediaQueryExpression',
		start,
		end: parser.index,
		key,
		value
	};
}

function readValue ( parser ) {
	const start = parser.index;
	const data = parser.readUntil( patterns.closingParen ); // TODO make this more sophisticated

	return {
		type: 'Value',
		start,
		end: parser.index,
		data
	};
}