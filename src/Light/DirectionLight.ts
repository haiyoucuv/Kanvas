/*
 * DirectionLight.ts
 * Created by 还有醋v on 2022/3/23.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Color, v3, Vector3 } from "../math";
import { Light } from "./Light";

/**
 * 方向光
 */
export class DirectionLight extends Light {

	constructor(color: Color = new Color()) {
		super(color);
	}

	/**
	 * 获得方向
	 */
	getDirection() {
		return v3().subVectors(Vector3.ZERO, this.position);
	}

}
