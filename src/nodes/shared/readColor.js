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

const hexPattern = /^#[a-f0-9]{3,8}/i;

function hex ( parser ) {
	const value = parser.read( hexPattern );
	if ( !value ) return;
	if ( value.length < 4 || value.length > 9 || value.length === 6 || value.length === 8 ) return;

	return value;
}

const rgbPattern = /^rgb\((?:\s*\d+%?[,\s]){2}\s*\d+%?\s*\)/;

function rgb ( parser ) {
	const value = parser.read( rgbPattern );
	if ( !value ) return;

	// TODO check stuff

	return value;
}

const rgbaPattern = /^rgba\((?:\s*\d+%?[,\s]){3}\s*(?:\/\s*)?(?:\d+%|\d|\d?\.\d+)?\s*\)/;

function rgba ( parser ) {
	const value = parser.read( rgbaPattern );
	if ( !value ) return;

	// TODO check stuff

	return value;
}

const hslPattern = /^hsla?\(\s*\d+\w*[,\s](?:\s*\d+%?[,\s]){1,2}\s*(?:\/\s*)?(?:\d+%|\d|\d?\.\d+)?\s*\)/;

function hsl ( parser ) {
	const value = parser.read( hslPattern );
	if ( !value ) return;

	// TODO check stuff

	return value;
}