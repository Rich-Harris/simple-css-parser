import * as patterns from '../../patterns.js';

export default function readQuantity ( parser ) {
	const start = parser.index;

	const value = (
		parser.read( patterns.percentage ) ||
		parser.read( patterns.length ) ||
		parser.read( patterns.angle ) ||
		parser.read( patterns.time ) ||
		parser.read( patterns.frequency ) ||
		parser.read( patterns.number )
	);

	if ( !value ) return;

	return {
		type: 'Quantity',
		start,
		end: parser.index,
		value
	};
}