import readString from '../shared/readString.js';
import readIdentifier from '../shared/readIdentifier.js';
import readQualifier from './readQualifier.js';
import * as patterns from '../../patterns.js';

const pattern = /^[a-z\-]+/i;

const standardPseudoClasses = [
	'active',
	'any',
	'checked',
	'default',
	'dir',
	'disabled',
	'empty',
	'enabled',
	'first',
	'first-child',
	'first-of-type',
	'fullscreen',
	'full-screen',
	'focus',
	'hover',
	'indeterminate',
	'in-range',
	'invalid',
	'lang',
	'last-child',
	'last-of-type',
	'left',
	'link',
	'not',
	'nth-child',
	'nth-last-child',
	'nth-last-of-type',
	'nth-of-type',
	'only-child',
	'only-of-type',
	'optional',
	'out-of-range',
	'read-only',
	'read-write',
	'required',
	'right',
	'root',
	'scope',
	'target',
	'valid',
	'visited',

	// level 4
	'any-link',
	'local-link',
	'scope',
	'active-drop-target',
	'valid-drop-target',
	'invalid-drop-target',
	'current',
	'past',
	'future',
	'placeholder-shown',
	'user-error',
	'blank',
	'nth-match',
	'nth-last-match',
	'nth-column',
	'nth-last-column',
	'matches'
];

const isStandard = {};
standardPseudoClasses.forEach( name => {
	isStandard[ name ] = true;
});

const parameterReaders = {
	dir: parser => {
		const direction = parser.read( /(?:ltr|rtl)/ );
		if ( !direction ) {
			parser.error( 'Expected ltr or rtl' );
		}

		return {
			type: 'Direction',
			start: parser.index - 3,
			end: parser.index,
			direction
		};
	},

	lang: parser => {
		// TODO in level 4, `:lang(zh, "*-hant")` e.g. is valid, as are wildcards
		return readString( parser ) || readIdentifier( parser );
	},

	matches: parser => {
		// TODO this is level 4 (https://drafts.csswg.org/selectors-4/#matches-pseudo)
		parser.error( 'TODO implement :matches' );
	},

	not: parser => {
		// TODO in level 4, this can be a selector list (https://drafts.csswg.org/selectors-4/#negation-pseudo)
		const qualifier = readQualifier( parser );
		if ( qualifier ) return qualifier;

		const start = parser.index;

		const name = parser.read( patterns.element );
		if ( name ) {
			return {
				type: 'Identifier',
				start,
				end: parser.index,
				name
			};
		}

		parser.error( 'Expected a selector' );
	},

	nth: parser => {
		const start = parser.index;

		// TODO level 4 adds [of S] (https://drafts.csswg.org/selectors-4/#the-nth-child-pseudo)
		const value = parser.read( /^(?:even|odd|[\+\-]?\d*n\s*[\+\-]\s*\d+|[\+\-]?\d+n?|n)/ );

		return {
			type: 'Indexes',
			start,
			end: parser.index,
			value
		};
	}
};



export default function readPseudoClassQualifier ( parser ) {
	const start = parser.index;

	if ( !parser.eat( ':' ) ) return;

	const name = parser.read( pattern );

	if ( !name ) {
		parser.error( 'Expected pseudo-class name' );
	}

	if ( !isStandard[ name ] ) {
		parser.error( `Unrecognised pseudo-class '${name}'` );
	}

	let parameter;

	const readParameter = name.startsWith( 'nth' ) ? parameterReaders.nth : parameterReaders[ name ];
	if ( readParameter ) {
		parser.eat( '(', true );
		parser.advance();

		parameter = readParameter( parser );

		parser.advance();
		parser.eat( ')', true );
	}

	return {
		type: 'PseudoClass',
		name,
		parameter,
		start,
		end: parser.index
	};
}