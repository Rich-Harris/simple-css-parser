const fs = require( 'fs' );
const path = require( 'path' );
const assert = require( 'assert' );
const marky = require( 'marky' );

const css = require( '../' );

describe( 'simple-css-parser', () => {
	after( () => {
		const entries = marky.getEntries();
		const total = entries.reduce( ( total, entry ) => total + entry.duration, 0 );

		console.log( `done in ${total}ms` );
	});

	fs.readdirSync( 'test/samples' ).forEach( dir => {
		if ( dir[0] === '.' ) return;

		it( dir, () => {
			const input = fs.readFileSync( path.join( 'test/samples', dir, 'input.css' ), 'utf-8' );

			const expected = require( `./samples/${dir}/output.json` );

			marky.mark( dir );
			const actual = css.parse( input );
			marky.stop( dir );

			assert.deepEqual( actual, expected );
		});
	});
});
