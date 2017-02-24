const pattern = /^progid\:[^;\}]+/i;

export default function readProgid ( parser ) {
	const start = parser.index;

	const value = parser.read( pattern );
	if ( !value ) return;

	return {
		type: 'Progid',
		start,
		end: parser.index,
		value
	};
}