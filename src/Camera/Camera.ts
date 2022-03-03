/*
 * Camera.ts
 * Created by 还有醋v on 2022/3/2.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Object3D } from "../core/Object3D";
import { mat4, Matrix4, Vector3 } from "../math";

export class Camera extends Object3D {

	// 投影矩阵，视图变换
	projectionMatrix: Matrix4 = mat4();

	constructor() {
		super();

	}

	lookUp(x: Vector3 | number, y: number, z: number) {
		if (x instanceof Vector3) {
			// this.worldMatrix.lookAt()
		}
	}


}
