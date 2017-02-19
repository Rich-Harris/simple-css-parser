import readString from '../shared/readString.js';
import readUri from '../shared/readUri.js';
import readMediaQueryList from '../shared/readMediaQueryList.js';

export default function augmentImport ( rule, parser ) {
	if ( parser.depth > 0 ) {
		parser.error( '@import declarations cannot be nested' );
	}

	parser.advance();
	const url = readString( parser ) || readUri( parser );
	parser.advance();

	const media = readMediaQueryList( parser );

	parser.advance();
	parser.eat( ';', true );

	rule.url = url;
	rule.media = media || null;
	rule.end = parser.index;
}