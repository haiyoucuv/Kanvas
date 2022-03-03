/*
 * PerspectiveCamera.ts
 * Created by 还有醋v on 2022/3/2.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Matrix4 } from "../math";
import { Camera } from "./Camera";

export class PerspectiveCamera extends Camera {

	constructor(
		public fov: number,
		public aspect: number,
		public near: number,
		public far: number
	) {
		super();

		this.projectionMatrix = new Matrix4().setPerspective(fov, aspect, near, far);

	}

}
