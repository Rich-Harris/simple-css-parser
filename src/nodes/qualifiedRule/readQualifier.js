import ident from '../tokens/ident.js';
import readString from '../shared/readString.js';
import readIdentifier from '../shared/readIdentifier.js';

export default function readQualifier ( parser ) {
	return (
		readIdQualifier( parser ) ||
		readClassQualifier( parser ) ||
		readPseudoElementQualifier( parser ) ||
		readPseudoClassQualifier( parser ) ||
		readAttributeQualifier( parser )
	);
}

function readIdQualifier ( parser ) {
	if ( !parser.eat( '#' ) ) return;

	const start = parser.index - 1;
	const value = ident( parser );

	if ( !value ) {
		parser.error( 'Expected valid ID' );
	}

	return {
		type: 'IdQualifier',
		value,
		start,
		end: parser.index
	};
}

function readClassQualifier ( parser ) {
	if ( !parser.eat( '.' ) ) return;

	const start = parser.index - 1;
	const value = ident( parser );

	if ( !value ) {
		parser.error( 'Expected valid ID' );
	}

	return {
		type: 'ClassQualifier',
		value,
		start,
		end: parser.index
	};
}

const pattern = /^[a-z\-]+/i;

function readPseudoElementQualifier ( parser ) {
	const start = parser.index;

	let name;

	const legacy = parser.match( /^:(?:first-line|first-letter|before|after)/ );

	if ( legacy ) {
		name = legacy.slice( 1 );
	} else {
		if ( !parser.eat( '::' ) ) return;
		name = parser.read( pattern );
	}

	return {
		type: 'PseudoElement',
		name,
		start,
		end: parser.index
	};
}

function readPseudoClassQualifier ( parser ) {
	const start = parser.index;

	if ( !parser.eat( ':' ) ) return;

	const name = parser.read( pattern );

	if ( !name ) {
		parser.error( 'Expected pseudo-class name' );
	}

	// TODO functions

	return {
		type: 'PseudoClass',
		name,
		start,
		end: parser.index
	};
}

const operators = /^(?:\^|~|\*)?=/;

function readAttributeQualifier ( parser ) {
	const start = parser.index;

	if ( !parser.eat( '[' ) ) return;

	parser.advance();

	const name = readIdentifier( parser );
	if ( !name ) parser.error( 'Expected attribute name' );

	parser.advance();

	const operator = parser.read( operators );
	let value;
	let casesensitive = true;

	if ( operator ) {
		value = readString( parser ) || readIdentifier( parser );
		parser.advance();

		if ( parser.read( /^[iI]/ ) ) {
			casesensitive = false;
			parser.advance;
		}
	}

	parser.eat( ']', true );

	return {
		type: 'AttributeQualifier',
		start,
		end: parser.index,
		name,
		operator,
		value,
		casesensitive
	};
}