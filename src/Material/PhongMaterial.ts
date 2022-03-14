/*
 * PhongMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { WebGLRender } from "../core/WebGLRender";
import Shader from "../Shader/Shader";
import { phongFrag, phongVert } from "../shaders";
import { BasicMaterial } from "./BasicMaterial";

class PhongMaterial extends BasicMaterial {

	constructor() {
		super();
	}

	initShader() {
		this.shader = new Shader(WebGLRender.gl, phongVert, phongFrag);
	}
}
