import augmentCharset from './augmentCharset.js';
import augmentImport from './augmentImport.js';
import augmentKeyframes from './augmentKeyframes.js';
import augmentMedia from './augmentMedia.js';
import augmentNamespace from './augmentNamespace.js';
import readIdentifier from '../shared/readIdentifier.js';

const augmenters = {
	charset: augmentCharset,
	import: augmentImport,
	media: augmentMedia,
	namespace: augmentNamespace,

	keyframes: augmentKeyframes
};

[ 'keyframes' ].forEach( name => {
	augmenters[ `-o-${name}` ] = augmenters[ `-ms-${name}` ] = augmenters[ `-moz-${name}` ] = augmenters[ `-webkit-${name}` ] = augmenters[ name ];
});

export default function atRule ( parser ) {
	const start = parser.index;

	if ( parser.eat( '@' ) ) {
		const identifier = readIdentifier( parser );

		if ( !identifier ) {
			parser.error( 'Expected an at-rule name' );
		}

		const augment = augmenters[ identifier.name.toLowerCase() ];

		if ( augment ) {
			const rule = {
				type: 'AtRule',
				subtype: identifier.name.replace( /^-\w+-/, '' ),
				start,
				end: null,
				name: identifier
			};

			augment( rule, parser );
			return rule;
		} else {
			parser.index = identifier.start;
			parser.error( `Unrecognised at-rule '${identifier.name}'` );
		}
	}
}