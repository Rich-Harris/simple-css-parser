import { locate } from 'locate-character';
import atRule from './nodes/atRule/index.js';
import qualifiedRule from './nodes/qualifiedRule/index.js';
import { whitespace } from './patterns.js';
import getCodeFrame from './utils/getCodeFrame.js';

function ParseError ( message, template, index, filename ) {
	const { line, column } = locate( template, index );

	this.name = 'ParseError';
	this.message = message;
	this.frame = getCodeFrame( template, line, column );

	this.loc = { line: line + 1, column };
	this.pos = index;
	this.filename = filename;
}

ParseError.prototype.toString = function () {
	return `${this.message} (${this.loc.line}:${this.loc.column})\n${this.frame}`;
};

export function parse ( css, options = {} ) {
	if ( typeof css !== 'string' ) {
		throw new TypeError( 'css must be a string' );
	}

	css = css.replace( /\s+$/, '' );

	const parser = {
		css,
		index: 0,
		depth: 0,

		error ( message, index = this.index ) {
			throw new ParseError( message, this.css, index, options.filename );
		},

		eat ( str, required ) {
			if ( this.match( str ) ) {
				this.index += str.length;
				return true;
			}

			if ( required ) {
				this.error( `Expected ${str}` );
			}
		},

		match ( str ) {
			return this.css.slice( this.index, this.index + str.length ) === str;
		},

		advance () {
			while ( this.index < this.css.length ) {
				if ( whitespace.test( this.css[ this.index ] ) ) {
					this.index++;
				}

				else if ( this.eat( '/*' ) ) {
					const start = this.index - 2;
					const value = this.readUntil( /\*\// );
					this.eat( '*/' );

					this.comments.push({ start, value, end: this.index });
				}

				else {
					return;
				}
			}
		},

		allowWhitespace () {
			while ( this.index < this.css.length && whitespace.test( this.css[ this.index ] ) ) {
				this.index++;
			}
		},

		read ( pattern ) {
			const match = pattern.exec( this.css.slice( this.index ) );
			if ( !match || match.index !== 0 ) return null;

			parser.index += match[0].length;

			return match[0];
		},

		readUntil ( pattern ) {
			if ( this.index >= this.css.length ) parser.error( 'Unexpected end of input' );

			const start = this.index;
			const match = pattern.exec( this.css.slice( start ) );

			if ( match ) {
				const start = this.index;
				this.index = start + match.index;
				return this.css.slice( start, this.index );
			}

			this.index = this.css.length;
			return this.css.slice( start );
		},

		remaining () {
			return this.css.slice( this.index );
		},

		requireWhitespace () {
			if ( !whitespace.test( this.css[ this.index ] ) ) {
				this.error( `Expected whitespace` );
			}

			this.allowWhitespace();
		},

		result: {
			type: 'StyleSheet',
			start: 0,
			end: css.length,
			body: [],
			comments: []
		}
	};

	parser.advance();

	while ( parser.index < parser.css.length ) {
		const node = atRule( parser ) || qualifiedRule( parser );

		if ( node ) {
			parser.result.body.push( node );
		} else {
			parser.error( 'Expected a rule' );
		}

		parser.advance();
	}

	return parser.result;
}
