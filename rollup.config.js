import resolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    targets: [
        { dest: 'dist/simple-css-parser.js', format: 'umd' },
        { dest: 'dist/simple-css-parser.es.js', format: 'es' }
    ],
    moduleName: 'cssParser',
    plugins: [
        resolve()
    ],
    sourceMap: true
};