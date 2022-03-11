/*
 * PbrMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { WebGLRender } from "../core/WebGLRender";
import Shader from "../Shader/Shader";
import { Texture } from "../Shader/Texture";
import { pbrFrag, pbrVert } from "../shaders";
import { BasicMaterial } from "./BasicMaterial";

export class PbrMaterial extends BasicMaterial {
	// 在渲染器里，第一次编译的时候附值
	static shader: Shader;

	static initShader() {
		PbrMaterial.shader = new Shader(WebGLRender.gl, pbrVert, pbrFrag);
	}

	normalMap: Texture;
	metallicMap: Texture;
	roughnessMap: Texture;
	aoMap: Texture;


}
