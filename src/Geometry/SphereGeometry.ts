/*
 * SphereGeometry.ts
 * Created by 还有醋v on 2022/3/11.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { v3 } from "../math";
import { Geometry } from "./Geometry";

export class SphereGeometry extends Geometry {

	constructor(
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

			// 两极的特殊情况
			let uOffset = 0;
			if (iy == 0 && thetaStart == 0) {
				uOffset = 0.5 / widthSegments;
			} else if (iy == heightSegments && thetaEnd == Math.PI) {
				uOffset = -0.5 / widthSegments;
			}

			for (let ix = 0; ix <= widthSegments; ix++) {
				const u = ix / widthSegments;

				// 顶点
				vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
				vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
				vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

				vertices.push(vertex.x, vertex.y, vertex.z);

				// 法线
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

		super(
			new Float32Array(vertices),
			new Uint16Array(indices),
			new Float32Array(normals),
			new Float32Array(uvs),
		);

	}
}
