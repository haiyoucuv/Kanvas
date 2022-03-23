/*
 * PointLight.ts
 * Created by 还有醋v on 2022/3/14.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Color } from "../math";
import { Light } from "./Light";

export class PointLight extends Light {

	constructor(color: Color = new Color()) {
		super(color);
	}

}
