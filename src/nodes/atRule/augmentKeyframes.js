import readIdentifier from '../shared/readIdentifier.js';
import readDeclarations from '../shared/readDeclarations.js';

export default function augmentKeyframes ( rule, parser ) {
	parser.advance();
	rule.animationname = readIdentifier( parser );
	parser.advance();

	rule.body = readBody( parser );
	rule.end = rule.body.end;
}

function readBody ( parser ) {
	const start = parser.index;

	parser.eat( '{', true );
	parser.advance();

	const frames = [];
	while ( !parser.match( '}' ) ) {
		const frame = readFrame( parser );
		frames.push( frame );
		parser.advance();
	}

	parser.eat( '}', true );

	return {
		type: 'Keyframes',
		start,
		end: parser.index,
		frames
	};
}

function readFrame ( parser ) {
	const start = parser.index;

	const selectors = [];
	while ( !parser.match( '{' ) ) {
		if ( parser.eat( 'from' ) ) {
			selectors.push( 'from' );
		} else if ( parser.eat( 'to' ) ) {
			selectors.push( 'to' );
		} else {
			const percentage = parser.read( /^(?:\d+(?:\.\d+)?|\.\d+)%/ );
			if ( percentage ) {
				const num = parseFloat( percentage );
				if ( num < 0 || num > 100 ) {
					parser.error( 'Value must be between 0% and 100%' );
				}
			} else {
				parser.error( 'Expected percentage' );
			}

			selectors.push( percentage );
		}

		parser.advance();
		if ( parser.eat( ',' ) ) {
			parser.advance();
		} else {
			break;
		}
	}

	parser.eat( '{', true );
	parser.advance();

	const declarations = readDeclarations( parser );

	return {
		type: 'Keyframe',
		start,
		end: parser.index,
		key: selectors.join( ',' ),
		declarations
	};
}