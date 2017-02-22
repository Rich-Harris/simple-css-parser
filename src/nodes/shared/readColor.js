export default function readColor ( parser ) {
	const start = parser.index;

	const value = (
		hex( parser ) ||
		rgb( parser ) ||
		rgba( parser ) ||
		hsl( parser )
	);

	if ( value ) {
		return {
			type: 'Color',
			start,
			end: parser.index,
			value
		};
	}
}

function hex ( parser ) {
	const value = parser.read( /^#[a-f0-9]{3,8}/i );
	if ( !value ) return;
	if ( value.length < 4 || value.length > 9 || value.length === 6 || value.length === 8 ) return;

	return value;
}

function rgb ( parser ) {
	const value = parser.read( /^rgb\((?:\s*\d+%?[,\s]){2}\s*\d+%?\s*\)/ );
	if ( !value ) return;

	// TODO check stuff

	return value;
}

function rgba ( parser ) {
	const value = parser.read( /^rgba\((?:\s*\d+%?[,\s]){3}\s*(?:\/\s*)?(?:\d+%|\d|\d?\.\d+)?\s*\)/ );
	if ( !value ) return;

	// TODO check stuff

	return value;
}

function hsl ( parser ) {
	const value = parser.read( /^hsla?\(\s*\d+\w*[,\s](?:\s*\d+%?[,\s]){1,2}\s*(?:\/\s*)?(?:\d+%|\d|\d?\.\d+)?\s*\)/ );
	if ( !value ) return;

	// TODO check stuff

	return value;
}