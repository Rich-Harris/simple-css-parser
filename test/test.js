const fs = require( 'fs' );
const path = require( 'path' );
const assert = require( 'assert' );
const marky = require( 'marky' );
const stringify = require( 'json-stable-stringify' );

require( 'console-group' ).install();

const css = require( '../' );

const keyOrders = {
	type: 1,
	start: 2,
	end: 3,

	selectors: 11,
	declarations: 12,

	feature: 21,
	expression: 22
};

function exists ( file ) {
	try {
		fs.statSync( file );
		return true;
	} catch ( err ) {
		return false;
	}
}

describe( 'simple-css-parser', () => {
	after( () => {
		const entries = marky.getEntries();
		const total = entries.reduce( ( total, entry ) => total + entry.duration, 0 );

		console.log( `done in ${total}ms` );
	});

	fs.readdirSync( 'test/samples' ).forEach( dir => {
		if ( dir[0] === '.' ) return;

		const solo = exists( path.join( 'test/samples', dir, 'solo' ) );

		( solo ? it.only : it )( dir, () => {
			const input = fs.readFileSync( path.join( 'test/samples', dir, 'input.css' ), 'utf-8' );

			const expected = require( `./samples/${dir}/output.json` );

			marky.mark( dir );
			const actual = css.parse( input );
			marky.stop( dir );

			const json = stringify( actual, {
				space: '\t',
				cmp: ( a, b ) => {
					if ( a.key in keyOrders && b.key in keyOrders ) {
						return keyOrders[ a.key ] - keyOrders[ b.key ];
					}

					if ( a.key in keyOrders ) return -1;
					if ( b.key in keyOrders ) return 1;

					return a.key < b.key ? -1 : b.key < a.key ? 1 : 0;
				}
			}).replace( /\[\n\t+\]/g, '[]' );

			fs.writeFileSync( path.join( 'test/samples', dir, '_actual.json' ), json );
			assert.deepEqual( actual, expected );
		});
	});
});
