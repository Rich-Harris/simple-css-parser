import * as patterns from '../../patterns.js';

const pattern = /^(?:%|em|ex|px|cm|mm|in|pt|pc|rem|vh|vw|vmin|vmax|q|deg|rad|grad|m?s|k?hz)/;

export default function readQuantity ( parser ) {
	const start = parser.index;

	const number = parser.read( patterns.number );
	if ( !number ) return;

	parser.read( pattern );

	const end = parser.index;

	return {
		type: 'Quantity',
		start,
		end: parser.index,
		value: parser.css.slice( start, end )
	};
}