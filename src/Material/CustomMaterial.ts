/*
 * CustomMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { WebGLRender } from "../core/WebGLRender";
import Shader from "../Shader/Shader";
import { Material } from "./Material";

export class CustomMaterial extends Material {

	vertexShader: string;
	fragShader: string;
	uniform: { [key in string]: any } = {};

	constructor(vertexShader: string, fragShader: string, uniform: { [key in string]: any } = {}) {
		super();
		this.vertexShader = vertexShader;
		this.fragShader = fragShader;
		this.uniform = uniform;
	}

	initShader() {
		this._shader = new Shader(WebGLRender.gl, this.vertexShader, this.fragShader);
	}

}
