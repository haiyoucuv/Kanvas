/*
 * Material.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { color, Color } from "../math";
import Shader from "../Shader/Shader";

export interface IMaterialOptions {
	alpha?: number,
	color?: Color,
}

export class Material {
	alpha: number = 1;
	color: Color = new Color();

	protected _shader: Shader = null;
	get shader(): Shader {
		return this._shader;
	}

	constructor(options?: IMaterialOptions) {

		this.alpha = (options?.alpha === void 0) ? 1 : options.alpha;
		this.color = options?.color || color();

	}

	initShader() {

	}
}
