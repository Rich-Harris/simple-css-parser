const fs = require( 'fs' );
const peg = require( 'pegjs' );

const grammar = fs.readFileSync( 'grammar.pegjs', 'utf-8' );

const parser = peg.generate( grammar, {
	output: 'source',
	optimize: 'size'
});

const es = parser.replace( '(function', 'export default (function' );
const umd = `
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.css = factory());
}(this,

${parser.replace( '})()', '})));' )}`.trim();

fs.writeFileSync( 'index.es.js', es );
fs.writeFileSync( 'index.js', umd );
