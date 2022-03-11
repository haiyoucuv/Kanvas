/*
 * WebGLRender.ts
 * Created by 还有醋v on 2022/3/10.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */


export class WebGLRender {

	static gl: WebGLRenderingContext = null;
	canvas: HTMLCanvasElement = null;

	get gl() {
		return WebGLRender.gl;
	}

	indexBuffer: WebGLBuffer;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const viewW = canvas.width;
		const viewH = canvas.height;


		const options = {
			alpha: true,
			antialias: false,   // 抗锯齿
			premultipliedAlpha: true,   // 预乘alpha
			stencil: true,
			preserveDrawingBuffer: true,
		};

		// const ctxName = ["webgl", "experimental-webgl"];
		// for (let i = 0; i < ctxName.length; i++) {
		// 	const gl = WebGLRender.gl = canvas.getContext("webgl", options) as WebGLRenderingContext;
		// 	if (gl) break;
		// }
		const gl = WebGLRender.gl = canvas.getContext("webgl", options) as WebGLRenderingContext;

		canvas.addEventListener("webglcontextlost", this.handleContextLost, false);
		canvas.addEventListener("webglcontextrestored", this.handleContextRestored, false);


		gl.getExtension("OES_standard_derivatives");

		gl.viewport(0, 0, viewW, viewH);

		gl.enable(gl.CULL_FACE); // 剔除背面
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.indexBuffer = gl.createBuffer();

	}

	handleContextLost = (event) => {
		event.preventDefault();
	}

	handleContextRestored = () => {
		const gl = this.gl;
		if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
			gl.getExtension('WEBGL_lose_context').restoreContext();
		}
	}

	render(scene) {

	}
}
