import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

// rollup.config.mjs
export default {
	input: 'src/index.js',
	output: {
		name: 'Vue',
		file: 'dist/vue.js',
		format: 'umd'
	},
	plugins: [
		json(),
		babel({
			exclude: 'node_modules/**'
		}),
		serve({
			openPage: 'index.html',
			contentBase: '',
			port: 8080
		}),
	]
};