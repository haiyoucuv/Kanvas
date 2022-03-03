/*
 * Created by 还有醋v on 2020/9/8.
 * Copyright © 2020 haiyoucuv. All rights reserved.
 */

import { v3 } from "../math";

/**
 * 取符合范围的值
 * @param value
 * @param min
 * @param max
 */
export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}


export function getSphere(
	radius = 1,
	widthSegments = 8,
	heightSegments = 6,
	phiStart = 0,
	phiLength = Math.PI * 2,
	thetaStart = 0,
	thetaLength = Math.PI,
) {

	widthSegments = Math.max(3, Math.floor(widthSegments));
	heightSegments = Math.max(2, Math.floor(heightSegments));

	const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

	let index = 0;
	const grid = [];

	const vertex = v3();
	const normal = v3();

	const indices = [];
	const vertices = [];
	const normals = [];
	const uvs = [];

	// 法线和uv
	for (let iy = 0; iy <= heightSegments; iy++) {

		const verticesRow = [];

		const v = iy / heightSegments;

		// special case for the poles
		let uOffset = 0;
		if (iy == 0 && thetaStart == 0) {
			uOffset = 0.5 / widthSegments;
		} else if (iy == heightSegments && thetaEnd == Math.PI) {
			uOffset = -0.5 / widthSegments;
		}

		for (let ix = 0; ix <= widthSegments; ix++) {
			const u = ix / widthSegments;

			// vertex
			vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
			vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
			vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

			vertices.push(vertex.x, vertex.y, vertex.z);

			// normal
			normal.copy(vertex).normalize();
			normals.push(normal.x, normal.y, normal.z);

			// uv
			uvs.push(u + uOffset, 1 - v);

			verticesRow.push(index++);

		}

		grid.push(verticesRow);

	}

	// 顶点
	for (let iy = 0; iy < heightSegments; iy++) {

		for (let ix = 0; ix < widthSegments; ix++) {

			const a = grid[iy][ix + 1];
			const b = grid[iy][ix];
			const c = grid[iy + 1][ix];
			const d = grid[iy + 1][ix + 1];

			if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
			if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);

		}

	}

	return { indices, vertices, normals, uvs, };
}

export function getBox() {

	// const colors = new Float32Array([    // Colors
	// 	0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
	// 	0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, // v0-v3-v4-v5 right(green)
	// 	1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, // v0-v5-v6-v1 up(red)
	// 	1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, // v1-v6-v7-v2 left
	// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v7-v4-v3-v2 down
	// 	0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, // v4-v7-v6-v5 back
	// ]);

	const vertices = [
		0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, // v0-v1-v2-v3 front
		0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, // v0-v3-v4-v5 right
		0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
		-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, // v1-v6-v7-v2 left
		-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, // v7-v4-v3-v2 down
		0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5  // v4-v7-v6-v5 back
	];


	const normals = [
		0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
		1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
		0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
		0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
		0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
	];

	const indices = [       // Indices of the vertices
		0, 1, 2, 0, 2, 3,    // front
		4, 5, 6, 4, 6, 7,    // right
		8, 9, 10, 8, 10, 11,    // up
		12, 13, 14, 12, 14, 15,    // left
		16, 17, 18, 16, 18, 19,    // down
		20, 21, 22, 20, 22, 23     // back
	];

	// , uvs
	return { indices, vertices, normals, };
}
