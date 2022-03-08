/*
 * index.js
 * Created by 还有醋v on 2022/2/25.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */


import { PerspectiveCamera } from "./Camera/PerspectiveCamera";
import { Object3D } from "./core/Object3D";
import { Scene } from "./core/Scene";
import { color, mat4, Matrix4, v3 } from "./math";
import Shader from "./Shader/Shader";
import { Texture } from "./Shader/Texture";
import { RES } from "./Tools/RES";
import { getBox, getSphere } from "./utils";

import {
	phongVert, phongFrag,
	pbrVert, pbrFrag,
	blinnPhongVert, blinnPhongFrag,
} from "./shaders";

// const { indices, vertices, normals, uvs } = getSphere(0.5, 30, 30);
const { indices, vertices, normals, uvs } = getBox();

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

	gl.getExtension("OES_standard_derivatives");

	gl.viewport(0, 0, viewW, viewH);

	gl.enable(gl.CULL_FACE); // 剔除背面
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.clearColor(0.2, 0.2, 0.2, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const lightPos = v3(0, 0, -1);
const lightColor = color();
const albedoColor = color(1.00, 0.86, 0.57).setHex(0x0095eb);

const camera = new PerspectiveCamera(60, winW / winH, 1, 1000);
camera.position.set(0, 0, -5);
// camera.rotationX = 90;
// camera.rotationY = 90;
camera.lookUp(v3());

const model = new Object3D();
const scene = new Scene();
scene.add(model);

async function initScene() {
	shader = new Shader(gl, pbrVert, pbrFrag);
	// shader = new Shader(gl, phongVert, phongFrag);
	// shader = new Shader(gl, blinnPhongVert, blinnPhongFrag);

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

	const basecolor = await RES.loadImage("./assets/rustediron1-alt2-bl/rustediron2_basecolor.png");
	const normal = await RES.loadImage("./assets/rustediron1-alt2-bl/rustediron2_normal.png");
	const metallic = await RES.loadImage("./assets/rustediron1-alt2-bl/rustediron2_metallic.png");
	const roughness = await RES.loadImage("./assets/rustediron1-alt2-bl/rustediron2_roughness.png");

	gl.activeTexture(gl.TEXTURE0);
	const basecolorTexture = new Texture(gl, basecolor).bind();

	gl.activeTexture(gl.TEXTURE1);
	const normalTexture = new Texture(gl, normal).bind();

	gl.activeTexture(gl.TEXTURE2);
	const metallicTexture = new Texture(gl, metallic).bind();

	gl.activeTexture(gl.TEXTURE3);
	const roughnessTexture = new Texture(gl, roughness).bind();

	shader.uniforms.u_texture = 0;
	shader.uniforms.albedoMap = 0;
	shader.uniforms.normalMap = 1;
	shader.uniforms.metallicMap = 2;
	shader.uniforms.roughnessMap = 3;

	loop();
}

function loop() {
	requestAnimationFrame(loop);

	camera._update();
	scene._update();

	const vp = mat4().multiplyMatrices(camera.projectionMatrix, camera.worldMatrix);

	shader.uniforms.vp = vp.toArray();

	shader.uniforms.viewPos = camera.position.toArray();

	shader.uniforms.lightPos = lightPos.toArray();
	shader.uniforms.lightColor = lightColor.toArray();

	model.rotationY += 0.0001;
	shader.uniforms.model = model.worldMatrix.toArray();

	const normalMat = model.worldMatrix.clone().invert().transpose();
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
lightPosGui.add(param.lightPos, "z", -5, 5, 0.1).onChange((e) => {
	lightPos.z = e;
});
