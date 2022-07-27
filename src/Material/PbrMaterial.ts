/*
 * PbrMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { WebGLRender } from "../core/WebGLRender";
import Shader from "../Shader/Shader";
import { Texture } from "../Shader/Texture";
import { pbrFrag, pbrVert } from "../shaders";
import { BasicMaterial, IBasicMaterialOptions } from "./BasicMaterial";

export interface IPbrMaterialOptions extends IBasicMaterialOptions {
	normalMap?: Texture,
	metallicMap?: Texture,
	roughnessMap?: Texture,
	aoMap?: Texture,
	metallic?: number,
	roughness?: number,
	ao?: number,
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

		const {
			metallic = 0.5, roughness = 0.5, ao = 1.0,
			normalMap, metallicMap, roughnessMap, aoMap
		} = options;

		this.metallic = metallic;
		this.roughness = roughness;
		this.ao = ao;

		this.normalMap = normalMap;
		this.metallicMap = metallicMap;
		this.roughnessMap = roughnessMap;
		this.aoMap = aoMap;

	}

	initShader() {
		let frag = pbrFrag;

		if (this.map) frag = "#define USE_MAP\n" + frag;

		if (this.normalMap) frag = "#define USE_NORMAL_MAP\n" + frag;

		if (this.metallicMap) frag = "#define USE_METALLIC_MAP\n" + frag;

		if (this.roughnessMap) frag = "#define USE_ROUGHNESS_MAP\n" + frag;

		if (this.aoMap) frag = "#define USE_AO_MAP\n" + frag;

		this._shader = new Shader(WebGLRender.gl, pbrVert, frag);
	}

}
