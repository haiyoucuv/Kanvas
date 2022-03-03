/*
 * rollup.prod.js
 * Created by 还有醋v on 2021/9/2.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

const json = require("@rollup/plugin-json");
const resolve = require("@rollup/plugin-node-resolve").default;
const typescript = require("@rollup/plugin-typescript");
const commonjs = require("rollup-plugin-commonjs");
const progress = require("rollup-plugin-progress");
const { terser } = require("rollup-plugin-terser");
const replace = require("rollup-plugin-replace");
const glslify = require("rollup-plugin-glslify");

module.exports = [
	{
		input: "src/index.ts",
		output: {
			file: "dist/Kanvas.js",
			format: "umd",
			sourcemap: true,
			name: "Kanvas",
		},
		plugins: [
			progress(),
			replace({
				ENV: JSON.stringify(process.env.NODE_ENV || 'prod'),
			}),
			resolve({ preferBuiltins: true }),
			typescript({ sourceMap: true, watch: false, }),
			commonjs(),
			json(),
			glslify(),
			terser(),
		]
	},
];
