/*
 * index.js
 * Created by 还有醋v on 2022/2/25.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */


import { PerspectiveCamera } from "./Camera/PerspectiveCamera";
import { color, mat4, Matrix4, v3 } from "./math";
import Shader from "./Shader/Shader";
import phongVs from "./shaders/phong.vert";
import phongFs from "./shaders/phong.frag";
import pbrVs from "./shaders/pbr.vert";
import pbrFs from "./shaders/pbr.frag";
import { getBox, getSphere } from "./utils";

const { indices, vertices, normals, uvs } = getSphere(0.5, 200, 200);
// const { indices, vertices, normals } = getBox();

const { innerWidth: winW, innerHeight: winH, devicePixelRatio: dip = 1 } = window;

let gl: WebGLRenderingContext = null;
let shader: Shader = null;

function initGL() {
	const canvas = document.createElement("canvas");
	const viewW = winW * dip;
	const viewH = winH * dip;
	canvas.width = viewW;
	canvas.height = viewH;
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	document.body.appendChild(canvas);

	gl = canvas.getContext("webgl");

	gl.viewport(0, 0, viewW, viewH);

	gl.enable(gl.CULL_FACE); // 剔除背面
	gl.enable(gl.DEPTH_TEST);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	gl.clearColor(0.2, 0.2, 0.2, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const viewPos = v3(0, 1, -3);
const lightPos = v3(0, 0, -1);
const lightColor = color();
const albedoColor = color(1.00, 0.86, 0.57).setHex(0x0095eb);

const model = mat4();

const camera = new PerspectiveCamera(60, winW / winH, 1, 1000);
camera.worldMatrix.setTranslate(lightPos.x, lightPos.y, lightPos.z);
camera.worldMatrix.setLookAt(viewPos, v3(), v3(0, 1, 0));


async function initScene() {
	shader = new Shader(gl, pbrVs, pbrFs);
	// const shader = new Shader(gl, phongVs, phongFs);

	shader.use();

	shader.attributes.pos.bind(new Float32Array(vertices)).pointer();
	shader.attributes.normal.bind(new Float32Array(normals)).pointer();
	shader.attributes.uv.bind(new Float32Array(uvs)).pointer();

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	shader.uniforms.alpha = 1;

	shader.uniforms.metallic = 0.5;
	shader.uniforms.roughness = 0.5;
	shader.uniforms.ao = 1.0;
	shader.uniforms.albedo = albedoColor.toArray();

	loop();
}

function loop() {
	requestAnimationFrame(loop);

	const vp = mat4().multiplyMatrices(camera.projectionMatrix, camera.worldMatrix);

	shader.uniforms.vp = vp.toArray();

	shader.uniforms.viewPos = viewPos.toArray();

	shader.uniforms.lightPos = lightPos.toArray();
	shader.uniforms.lightColor = lightColor.toArray();

	// model.rotate(0.2, 1, 1, 1);
	shader.uniforms.model = model.toArray();

	const normalMat = model.clone().invert().transpose();
	shader.uniforms.normalMat = normalMat.toArray();

	shader.uniforms.color = color(1, 1, 1).toArray();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

initGL();
initScene();

import { GUI } from 'dat.gui';

const param = {
	metallic: 0.5,
	roughness: 0.5,
	ao: 1,
	albedo: albedoColor.getHex(),
	lightPos: {
		x: lightPos.x,
		y: lightPos.y,
		z: lightPos.z,
	}
}

const gui = new GUI();
gui.add(param, "metallic", 0, 1, 0.01).onChange((e) => {
	shader.uniforms.metallic = e;
});
gui.add(param, "roughness", 0, 1, 0.01).onChange((e) => {
	shader.uniforms.roughness = e;
});
gui.add(param, "ao", 0, 3, 0.1).onChange((e) => {
	shader.uniforms.ao = e;
});
gui.addColor(param, "albedo").onChange((e) => {
	shader.uniforms.albedo = albedoColor.setHex(e).toArray();
});

const lightPosGui = gui.addFolder("lightPos");
lightPosGui.add(param.lightPos, "x", -5, 5, 0.1).onChange((e) => {
	lightPos.x = e;
});
lightPosGui.add(param.lightPos, "y", -5, 5, 0.1).onChange((e) => {
	lightPos.y = e;
});
lightPosGui.add(param.lightPos, "z", -5, -1, 0.1).onChange((e) => {
	lightPos.z = e;
});
