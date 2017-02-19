import * as patterns from '../../patterns.js';

export default function augmentViewport ( rule, parser ) {
	parser.advance();
	parser.eat( '{', true );
	parser.advance();

	rule.body = [];

	while ( !parser.match( '}' ) ) {
		const declaration = readViewportDeclaration( parser );

		if ( declaration ) {
			rule.body.push( declaration );
		} else {
			parser.error( 'Expected a viewport declaration' );
		}

		parser.advance();
	}

	parser.eat( '}', true );
	rule.end = parser.index;
}

function readDimension ( parser ) {
	const start = parser.index;

	const value = (
		parser.read( patterns.universalKeywords ) ||
		parser.read( /device-(?:width|height)/i ) ||
		parser.read( patterns.length ) ||
		parser.read( patterns.percentage )
	);

	if ( !value ) return;

	return {
		type: 'Dimension',
		start,
		end: parser.index,
		value
	};
}

function readZoom ( parser ) {
	const start = parser.index;
	const value = parser.read( patterns.universalKeywords ) || parser.read( patterns.percentage ) || parser.read( patterns.number );

	if ( !value ) return;

	return {
		type: 'Zoom',
		start,
		end: parser.index,
		value
	};
}

const validDescriptors = {
	width: readDimension,
	'min-width': readDimension,
	'max-width': readDimension,
	height: readDimension,
	'min-height': readDimension,
	'max-height': readDimension,
	zoom: readZoom,
	'min-zoom': readZoom,
	'max-zoom': readZoom,
	'user-zoom': readZoom,
	orientation: parser => {
		const start = parser.index;
		const value = parser.read( patterns.universalKeywords ) || parser.read( /(?:landscape|portrait)/i );

		return {
			type: 'Orientation',
			start,
			end: parser.index,
			value
		};
	},
};

const pattern = new RegExp( `^(?:${Object.keys( validDescriptors ).join( '|' )})` );

function readViewportDeclaration ( parser ) {
	const start = parser.index;

	const key = parser.read( pattern );
	if ( !key ) parser.error( `Expected a valid viewport descriptor` );
	parser.advance();

	parser.eat( ':', true );
	parser.advance();

	const reader = validDescriptors[ key ];
	const value = reader( parser );

	if ( !value ) parser.error( `Expected a valid value` );

	parser.advance();
	parser.eat( ';', true );

	return {
		type: 'ViewportDeclaration',
		start,
		end: parser.index,
		key,
		value
	};
}