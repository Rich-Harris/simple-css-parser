import readMediaQueryList from '../shared/readMediaQueryList.js';
import atRule from './index.js';
import qualifiedRule from '../qualifiedRule/index.js';

export default function augmentMedia ( rule, parser ) {
	parser.advance();

	rule.queries = readMediaQueryList( parser );

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