/*
 * Object3D.ts
 * Created by 还有醋v on 2022/3/2.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { mat4, Matrix4 } from "../math";

export class Object3D {

	// 世界矩阵
	worldMatrix: Matrix4 = mat4();

	// 模型矩阵
	modelMatrix: Matrix4 = mat4();

	constructor() {
	}

}
