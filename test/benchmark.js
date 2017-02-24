const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );

const syntacss = require( '../dist/simple-css-parser.js' );
const postcss = require( 'postcss' );

const samples = glob.sync( '**/*.css', { cwd: 'test/samples' }).map( file => {
	return {
		file,
		css: fs.readFileSync( path.join( 'test/samples', file ), 'utf-8' )
	};
});

function time ( label, fn ) {
	const start = Date.now();
	fn();
	const end = Date.now();

	console.log( `${label}: ${end - start}ms` );
}

time( 'syntacss', () => {
	samples.forEach( sample => {
		syntacss.parse( sample.css );
	});
});

time( 'postcss', () => {
	samples.forEach( sample => {
		postcss.parse( sample.css );
	});
});