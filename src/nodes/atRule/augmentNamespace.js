import readIdentifier from '../shared/readIdentifier.js';
import readString from '../shared/readString.js';
import readUri from '../shared/readUri.js';

export default function augmentNamespace ( rule, parser ) {
	parser.advance();

	const start = parser.index;

	rule.prefix = readIdentifier( parser ) || null;
	if ( rule.prefix ) {
		if ( rule.prefix.name === 'url' ) {
			// special case — backtrack
			parser.index = start;
			rule.prefix = null;
		} else {
			parser.advance();
		}
	}

	rule.namespace = readString( parser ) || readUri( parser );

	if ( !rule.namespace ) {
		parser.error( 'Expected a namespace' );
	}

	parser.advance();
	parser.eat( ';', true );

	rule.end = parser.index;
}