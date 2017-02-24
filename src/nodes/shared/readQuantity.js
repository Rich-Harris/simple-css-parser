import * as patterns from '../../patterns.js';

export default function readQuantity ( parser ) {
	const start = parser.index;

	const number = parser.read( patterns.number );
	if ( !number ) return;

	parser.read( /^(?:%|em|ex|px|cm|mm|in|pt|pc|rem|vh|vw|vmin|vmax|q|deg|rad|grad|m?s|k?hz)/ );

	const end = parser.index;

	return {
		type: 'Quantity',
		start,
		end: parser.index,
		value: parser.css.slice( start, end )
	};
}