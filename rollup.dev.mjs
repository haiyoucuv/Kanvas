/*
 * rollup.dev.js
 * Created by 还有醋v on 2021/9/2.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import livereload from "rollup-plugin-livereload";
import progress from "rollup-plugin-progress";
import replace from "rollup-plugin-replace";
import serve from "rollup-plugin-serve";
// import { glslLoader } from "./glslLoader.mjs";
import  glslLoader from "rollup-plugin-glsl-loader";


export default {
	input: "src/index.ts",
	cache: true,
	output: [
		{
			file: "build/Kanvas.js",
			format: "umd",
			sourcemap: true,
			name: "Kanvas",
			globals: {
				'dat.gui': "dat"
			}
		},
		{
			file: 'build/Kanvas.module.js',
			format: 'esm',
			sourcemap: true,
			globals: {
				'dat.gui': "dat"
			}
		}
	],
	plugins: [
		progress(),
		replace({
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
		// resolve(),
		typescript({ tsconfig: "./tsconfig.json" }),
		// commonjs(),
		json(),
		glslLoader({
			glslify: true,
		}),
		// glslify(),
		// glslOptimize({
		// 	optimize: false,
		// 	glslify: true,
		// }),
		serve({
			port: 8081,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
		}),
		livereload(),
	]
};
