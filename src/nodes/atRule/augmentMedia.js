import readIdentifier from '../shared/readIdentifier.js';
import atRule from './index.js';
import qualifiedRule from '../qualifiedRule/index.js';

const conditions = /^(?:only|not)/i;
const mediaTypes = /^(?:all|print|screen|speech|tty|tv|projection|handheld|braille|embossed|aural)/i;

export default function augmentMedia ( rule, parser ) {
	parser.advance();

	const condition = parser.read( conditions );
	if ( condition ) parser.advance();
	rule.not = condition ? condition.toLowerCase() === 'not' : false;

	const media = parser.read( mediaTypes );
	if ( media ) parser.advance();
	rule.media = media;

	if ( condition && !media ) {
		parser.error( 'Expected a valid media type' );
	}

	if ( media ) {
		if ( parser.read( /and/i ) ) {
			parser.advance();
			rule.expressions = readMediaFeatures( parser );
		} else {
			rule.expressions = [];
		}
	} else {
		rule.expressions = readMediaFeatures( parser );
	}

	parser.eat( '{', true );
	parser.depth += 1;

	parser.advance();

	rule.body = [];
	while ( !parser.match( '}' ) ) {
		const node = atRule( parser ) || qualifiedRule( parser );

		if ( node ) {
			rule.body.push( node );
		} else {
			parser.error( 'Expected a rule' );
		}

		parser.advance();
	}

	parser.eat( '}', true );
	rule.end = parser.index;

	parser.depth -= 1;
}

function readMediaFeatures ( parser ) {
	const expressions = [];

	let expression;
	while ( expression = readMediaFeature( parser ) ) {
		expressions.push( expression );

		parser.advance();
		if ( parser.read( /and/i ) ) {
			parser.advance();
		} else {
			return expressions;
		}
	}

	parser.error( 'Expected a media query' );
}

function readMediaFeature ( parser ) {
	const start = parser.index;

	parser.eat( '(', true );
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
		type: 'MediaQuery',
		start,
		end: parser.index,
		key,
		value
	};
}

function readValue ( parser ) {
	const start = parser.index;
	const data = parser.readUntil( /\)/ ); // TODO make this more sophisticated

	return {
		type: 'Value',
		start,
		end: parser.index,
		data
	};
}