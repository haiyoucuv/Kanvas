/*
 * glslLoader.js
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import fs from "fs";
import fsSync from "fs";
import path from "path";

export function glslLoader(options) {
	
	const pluginOptions = {
		glslify: false,
		glslifyOptions: {},
		...options,
	};
	
	let glslifyCompile = null;
	
	const glslifyInit = async () => {
		if (glslifyCompile) return;
		try {
			const glslify = await import('glslify');
			if (glslify && glslify.compile && typeof glslify.compile === 'function') {
				glslifyCompile = glslify.compile;
			}
		} catch (e) {
		
		}
	}
	
	const glslifyLoadSource = async (id, source, options, failError, warnLog = console.error) => {
		if (!glslifyCompile) {
			failError(`glslify could not be found. Install it with npm i -D glslify`);
		}
		
		let basedir = path.dirname(id);
		if (!fsSync.existsSync(basedir)) {
			warnLog(`Error resolving path: '${id}' : glslify may fail to find includes`);
			basedir = process.cwd();
		}
		
		return glslifyCompile(source, ({ basedir, ...options }));
	}
	
	const includeRegExp = /#include (["^+"]?["\ "[a-zA-Z_0-9](.*)"]*?)/g;
	
	// loader
	const loadSource = (id, onerror) => {
		// 如果没有
		if (!fs.existsSync(id)) {
			onerror({ message: `\n${id} is not found! Please make sure it exists` });
		}
		
		let source = fs.readFileSync(id, { encoding: 'utf8' });
		return source.replace(includeRegExp, (_, strMatch) => {
			const includeOpt = strMatch.split(' ');
			const includeName = includeOpt[0].replace(/"/g, '');
			const includePath = path.resolve(id, "..", includeName);
			
			// 递归检查 #include
			return loadSource(includePath, onerror);
		});
	}
	
	return {
		name: "rollup-plugin-glsl",
		
		async options(options) {
			if (pluginOptions.glslify) {
				await glslifyInit();
			}
		},
		
		async load(id) {
			if (/\.(glsl|vs|fs|vert|frag)$/.test(id)) {
				let source = loadSource(id, this.error.bind(this));
				
				// 载入 glslify
				if (pluginOptions.glslify) {
					try {
						source = await glslifyLoadSource(
							id,
							source,
							pluginOptions.glslifyOptions,
							(message) => this.error({ message })
						);
					} catch (err) {
						this.error({
							message: `Error load glsl file with glslify:\n${err.message}`
						});
					}
				}
				
				// 导出es模块
				return `export default ${JSON.stringify(source)}`;
			}
		},
	}
	
}
