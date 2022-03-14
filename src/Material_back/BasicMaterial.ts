/*
 * BasicMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { color, Color } from "../math";
import Shader from "../Shader/Shader";
import { Texture } from "../Shader/Texture";
import { Material } from "./Material";

export class BasicMaterial extends Material {

	// 在渲染器里，第一次编译的时候附值
	static shader: Shader;

	static initShader() {

	}

	// get uniforms() {
	// 	// @ts-ignore
	// 	return this.constructor.shader.uniforms;
	// }

	map: Texture;

	constructor() {
		super();

		const cls = this.constructor;
		if (!cls["shader"]) cls["initShader"]();

	}

}
