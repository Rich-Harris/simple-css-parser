import readColor from './readColor.js';
import readFunction from './readFunction.js';
import readGarbage from './readGarbage.js';
import readIdentifier from './readIdentifier.js';
import readProgid from './readProgid.js';
import readQuantity from './readQuantity.js';
import readString from './readString.js';
import readUri from './readUri.js';

export default function readExpression ( parser ) {
	return (
		readQuantity( parser ) ||
		readString( parser ) ||
		readUri( parser ) ||
		readColor( parser ) ||
		readProgid( parser ) ||
		readFunction( parser ) ||
		readIdentifier( parser ) ||
		readGarbage( parser )
	);
}