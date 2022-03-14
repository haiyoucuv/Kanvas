/*
 * PbrMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { WebGLRender } from "../core/WebGLRender";
import { color } from "../math";
import Shader from "../Shader/Shader";
import { Texture } from "../Shader/Texture";
import { pbrFrag, pbrVert } from "../shaders";
import { BasicMaterial, IBasicMaterialOptions } from "./BasicMaterial";

export interface IPbrMaterialOptions extends IBasicMaterialOptions {
	normalMap?: Texture,
	metallicMap?: Texture,
	roughnessMap?: Texture,
	aoMap?: Texture,
}

export class PbrMaterial extends BasicMaterial {

	normalMap: Texture;
	metallicMap: Texture;
	roughnessMap: Texture;
	aoMap: Texture;

	metallic = 0.5;
	roughness = 0.5;
	ao = 1.0;

	constructor(options?: IPbrMaterialOptions) {
		super(options);

		this.normalMap = options?.normalMap;
		this.metallicMap = options?.metallicMap;
		this.roughnessMap = options?.roughnessMap;
		this.aoMap = options?.aoMap;

	}

	initShader() {
		this.shader = new Shader(WebGLRender.gl, pbrVert, pbrFrag);
	}

}
