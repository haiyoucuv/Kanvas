/*
 * WebGLRender.ts
 * Created by 还有醋v on 2022/3/10.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */


import { Camera } from "../Camera/Camera";
import { Light } from "../Light/Light";
import { color } from "../math";
import Shader from "../Shader/Shader";
import { Texture } from "../Shader/Texture";
import { Mesh3D } from "./Mesh3D";
import { Object3D } from "./Object3D";

const defaultUniforms = [
	"vp", "model", "alpha", "normalMat", "viewPos", "lightColor", "lightPos"
];

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
		gl.depthFunc(gl.LEQUAL);
		gl.depthMask(true);
		gl.colorMask(true, true, true, true);
		// gl.enable(gl.BLEND);
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


		gl.clearColor(.2, .2, .2, 1);
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

	/**
	 * 获取渲染数据
	 */
	getRenderData(obj: Object3D, renderData = { alpha: [], mesh: [], light: [], camera: [], }) {
		if (obj instanceof Mesh3D) {
			// 透明和非透明分开
			if (obj.material.alpha < 1) {
				renderData.alpha.push(obj);
			} else {
				renderData.mesh.push(obj);
			}
		} else if (obj instanceof Camera) {
			renderData.camera.push(obj);
		} else if (obj instanceof Light) {
			renderData.light.push(obj);
		}

		const children = obj.children;
		const len = children.length;
		for (let i = 0; i < len; i++) {
			this.getRenderData(children[i], renderData);
		}

		return renderData;
	}

	/**
	 * 获取除通用uniform的其他uniform数据
	 */
	getCusUniforms(shader: Shader) {
		const uniformData = JSON.parse(JSON.stringify(shader.uniformData));
		defaultUniforms.forEach((v) => delete uniformData[v]);
		return uniformData;
	}

	render(scene: Object3D, camera: Camera) {

		scene._update();
		camera._update();

		const gl = this.gl;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const renderData = this.getRenderData(scene);

		// 先渲染不透明物体
		gl.disable(gl.BLEND);
		const mlen = renderData.mesh.length;
		for (let i = 0; i < mlen; i++) {
			gl.depthMask(true);
			gl.disable(gl.BLEND);
			this.renderObj(renderData.mesh[i], camera, renderData.light);
		}

		// 再渲染带透明物体
		gl.disable(gl.CULL_FACE);
		gl.enable(gl.BLEND);
		gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
		// TODO 根据相机远近进行排序？
		const alen = renderData.alpha.length;
		for (let i = 0; i < alen; i++) {
			this.renderObj(renderData.alpha[i], camera, renderData.light);
		}


	}

	renderObj(obj: Mesh3D, camera: Camera, lights: Light[]) {
		const gl = this.gl;

		const { material, geometry, worldMatrix } = obj;

		if (!material.shader) material.initShader();

		const shader = material.shader;
		const { vertices, normals, uvs, colors, indices } = geometry;

		shader.use();

		/* 设置 attribute */
		shader.attributes.pos.bind(vertices).pointer();
		shader.attributes.normal.bind(normals).pointer();
		shader.attributes.uv.bind(uvs).pointer();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		/* 设置 uniform */

		/* 固定的 uniform */
		// vp
		const vp = camera.projectionMatrix.clone().multiply(camera.worldMatrix.clone().invert());
		shader.uniforms.vp = vp.toArray();

		// 观察位置
		shader.uniforms.viewPos = camera.position.toArray();

		// 模型世界矩阵
		shader.uniforms.model = worldMatrix.toArray();

		// 法线矩阵
		const normalMat = worldMatrix.clone().invert().transpose();
		shader.uniforms.normalMat = normalMat.toArray();

		shader.uniforms.alpha = material.alpha;

		shader.uniforms.color = material.color.toArray();

		shader.uniforms.lightPos = lights[0].position.toArray();
		shader.uniforms.lightColor = lights[0].color.toArray();

		const cusUniforms = this.getCusUniforms(shader);

		let curTextureUnit = 0;
		for (let key in cusUniforms) {
			const type = cusUniforms[key].type;
			if (
				type === "float"
				|| type === "int"
				|| type === "bool"
			) { // 浮点数直接附值
				shader.uniforms[key] = material[key];
			} else if (type === "sampler2D") {  // 贴图循环绑定
				(material[key] as Texture).bind(gl[`TEXTURE${curTextureUnit}`]);
				shader.uniforms[key] = curTextureUnit;
				curTextureUnit++;
			} else {    // 其他的应该直接toArray()就行吧
				shader.uniforms[key] = material[key].toArray();
			}
		}

		/* 根据材质来的 uniform */
		// shader.uniforms.metallic = 0.5;
		// shader.uniforms.roughness = 0.5;
		// shader.uniforms.ao = 1.0;
		// shader.uniforms.albedo = color(1.00, 0.86, 0.57).setHex(0x0095eb).toArray();
		//
		// shader.uniforms.map = 0;
		// shader.uniforms.normalMap = 1;
		// shader.uniforms.metallicMap = 2;
		// shader.uniforms.roughnessMap = 3;


		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
