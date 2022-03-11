/*
 * Mesh3D.ts
 * Created by 还有醋v on 2022/3/11.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Geometry } from "../Geometry/Geometry";
import { Material } from "../Material/Material";
import { Object3D } from "./Object3D";

export class Mesh3D extends Object3D {
	constructor(
		public geometry: Geometry,
		public material: Material
	) {
		super();
	}
}
