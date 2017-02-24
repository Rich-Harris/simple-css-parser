import atRule from './index.js';
import qualifiedRule from '../qualifiedRule/index.js';
import readUri from '../shared/readUri.js';

export default function augmentDocument ( rule, parser ) {
	parser.advance();

	rule.whitelist = readDocumentFunctionList( parser );

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

	parser.depth -= 1;

	rule.end = parser.index;
}

function readDocumentFunctionList ( parser ) {
	const whitelist = [];

	let fn;

	while ( fn = readUri( parser ) || readDocumentFunction( parser ) ) {
		whitelist.push( fn );

		parser.advance();
		if ( !parser.eat( ',' ) ) break;
		parser.advance();
	}

	if ( !whitelist.length ) return;
	return whitelist;
}

function readDocumentFunction ( parser ) {
	const start = parser.index;

	const value = parser.read( /^(?:url-prefix|domain|regexp)\(.*?\)/i );
	if ( !value ) return;

	return {
		type: 'DocumentFunction',
		start,
		end: parser.index,
		value
	};
}