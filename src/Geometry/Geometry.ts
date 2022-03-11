/*
 * Geometry.ts
 * Created by 还有醋v on 2022/3/11.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

export class Geometry {

	vertices: Float32Array;
	indices: Uint16Array;
	normals: Float32Array;
	colors: Float32Array;
	uvs: Float32Array;

	constructor(
		vertices: Float32Array,
		indices?: Uint16Array,
		normals?: Float32Array,
		uvs?: Float32Array,
		colors?: Float32Array,
	) {
		this.vertices = vertices;
		this.indices = indices;

		const vertArrLen = vertices.length;
		this.normals = normals || new Float32Array(vertArrLen);
		this.uvs = uvs || new Float32Array(vertArrLen / 3 * 2);
		// 默认白色
		this.colors = colors || new Float32Array(new Array(vertArrLen).fill(1));
	}

}
