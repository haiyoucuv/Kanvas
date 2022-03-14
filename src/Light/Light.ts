/*
 * Light.ts
 * Created by 还有醋v on 2022/3/14.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Object3D } from "../core/Object3D";
import { color, Color } from "../math";

export class Light extends Object3D {

	color: Color = color();

	constructor() {
		super();
	}

}
