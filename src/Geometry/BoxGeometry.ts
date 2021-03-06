/*
 * BoxGeometry.ts
 * Created by 还有醋v on 2022/3/11.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { Geometry } from "./Geometry";

export class BoxGeometry extends Geometry {

	constructor() {

		const uvs = new Float32Array([
			1, 1, 0, 1, 0, 0, 1, 0, //v0-v1-v2-v3 front
			0, 1, 0, 0, 1, 0, 1, 1, //v0-v3-v4-v5 right
			1, 0, 1, 1, 0, 1, 0, 0, //v0-v5-v6-v1 top
			1, 1, 0, 1, 0, 0, 1, 0, //v1-v6-v7-v2 left
			0, 0, 1, 0, 1, 1, 0, 1, //v7-v4-v3-v2 bottom
			0, 0, 1, 0, 1, 1, 0, 1, //v4-v7-v6-v5 back
		]);

		const vertices = new Float32Array([
			0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, // v0-v1-v2-v3 front
			0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, // v0-v3-v4-v5 right
			0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
			-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, // v1-v6-v7-v2 left
			-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, // v7-v4-v3-v2 down
			0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5  // v4-v7-v6-v5 back
		]);


		const normals = new Float32Array([
			0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
			1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
			0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
			-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
			0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
			0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
		]);

		const indices = new Uint16Array([       // Indices of the vertices
			0, 1, 2, 0, 2, 3,    // front
			4, 5, 6, 4, 6, 7,    // right
			8, 9, 10, 8, 10, 11,    // up
			12, 13, 14, 12, 14, 15,    // left
			16, 17, 18, 16, 18, 19,    // down
			20, 21, 22, 20, 22, 23     // back
		]);

		super(vertices, indices, normals, uvs);
	}
}
