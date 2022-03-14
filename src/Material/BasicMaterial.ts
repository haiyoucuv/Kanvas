/*
 * BasicMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Texture } from "../Shader/Texture";
import { IMaterialOptions, Material } from "./Material";

export interface IBasicMaterialOptions extends IMaterialOptions {
	map?: Texture,
}

export class BasicMaterial extends Material {

	map: Texture;

	constructor(options?: IBasicMaterialOptions) {
		super(options);

		this.map = options?.map;

	}

	initShader() {

	}

}
