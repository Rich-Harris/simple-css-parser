const fs = require( 'fs' );
const path = require( 'path' );
const assert = require( 'assert' );
const glob = require( 'glob' );
const marky = require( 'marky' );
const chalk = require( 'chalk' );
const stringify = require( 'json-stable-stringify' );

require( 'console-group' ).install();
require( 'source-map-support' ).install();

const css = require( '../' );

const keyOrders = {
	type: 1,
	start: 2,
	end: 3,

	key: 10,

	selectors: 11,
	declarations: 12,

	media: 18,
	not: 19,
	feature: 21,
	expression: 22,
	expressions: 23,

	subtype: 29,
	name: 30,
	animationname: 31,
	queries: 32,

	comments: 90,
	body: 91
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
	describe( 'tests', () => {
		after( () => {
			const entries = marky.getEntries();
			const total = entries.reduce( ( total, entry ) => total + entry.duration, 0 );

			console.log( `done in ${total}ms` );
		});

		fs.readdirSync( 'test/tests' ).forEach( dir => {
			if ( dir[0] === '.' ) return;

			const skip = exists( path.join( 'test/tests', dir, 'input.skip.css' ) );
			const solo = exists( path.join( 'test/tests', dir, 'input.solo.css' ) );

			( solo ? it.only : skip ? it.skip : it )( dir, () => {
				const input = fs.readFileSync( path.join( 'test/tests', dir, solo ? 'input.solo.css' : 'input.css' ), 'utf-8' );

				const expected = require( `./tests/${dir}/output.json` );
				let actual;

				try {
					marky.mark( dir );
					actual = css.parse( input );
					marky.stop( dir );
				} catch ( err ) {
					if ( err.name === 'ParseError' ) {
						console.error( chalk.red( `${err.message}\n${err.frame}` ) );
					}

					throw err;
				}

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

				fs.writeFileSync( path.join( 'test/tests', dir, '_actual.json' ), json );
				assert.deepEqual( actual, expected );
			});
		});
	});

	describe( 'samples', function () {
		this.timeout( 20000 );

		after( () => {
			const entries = marky.getEntries();
			const total = entries.reduce( ( total, entry ) => total + entry.duration, 0 );

			console.log( `done in ${total}ms` );
		});

		glob.sync( '**/*.css', { cwd: 'test/samples' }).forEach( file => {
			const solo = /\.solo\.css$/.test( file );
			const skip = /\.skip\.css$/.test( file );

			( solo ? it.only : skip ? it.skip : it )( file, () => {
				const input = fs.readFileSync( path.join( 'test/samples', file ), 'utf-8' );

				try {
					marky.mark( file );
					css.parse( input );
					marky.stop( file );
				} catch ( err ) {
					if ( err.name === 'ParseError' ) {
						console.error( chalk.red( `${err.message}\n${err.frame}` ) );
					}

					throw err;
				}
			});
		});
	});
});
