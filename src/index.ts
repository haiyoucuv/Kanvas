/*
 * index.js
 * Created by 还有醋v on 2022/2/25.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */


import { PerspectiveCamera } from "./Camera/PerspectiveCamera";
import { Mesh3D } from "./core/Mesh3D";
import { Object3D } from "./core/Object3D";
import { Scene } from "./core/Scene";
import { WebGLRender } from "./core/WebGLRender";
import { BoxGeometry } from "./Geometry/BoxGeometry";
import { SphereGeometry } from "./Geometry/SphereGeometry";
import { PbrMaterial } from "./Material/PbrMaterial";
import { color, mat4, Matrix4, v3 } from "./math";
import Shader from "./Shader/Shader";
import { Texture } from "./Shader/Texture";
import { RES } from "./Tools/RES";

import {
	phongVert, phongFrag,
	pbrVert, pbrFrag,
	blinnPhongVert, blinnPhongFrag,
} from "./shaders";

const { indices, vertices, normals, uvs } = new SphereGeometry(0.5, 30, 30);
// const { indices, vertices, normals, uvs } = new BoxGeometry();

const { innerWidth: winW, innerHeight: winH, devicePixelRatio: dip = 1 } = window;
const viewW = winW * dip;
const viewH = winH * dip;

const canvas = document.createElement("canvas");
canvas.width = viewW;
canvas.height = viewH;
canvas.style.width = "100%";
canvas.style.height = "100%";
document.body.appendChild(canvas);

let gl: WebGLRenderingContext = null;
let shader: Shader = null;

gl = new WebGLRender(canvas).gl;

WebGLRender.gl = gl;

const material = new PbrMaterial();

const mesh = new Mesh3D(
	new SphereGeometry(0.5, 30, 30),
	material,
);

const lightPos = v3(0, 0, 1);
const lightColor = color();
const albedoColor = color(1.00, 0.86, 0.57).setHex(0x0095eb);

const camera = new PerspectiveCamera(60, viewW / viewH, 1, 1000);
camera.position.set(1, 0, 4);
camera.updateWorldMatrix();
camera.lookAt(v3());

const model = new Object3D();
const scene = new Scene();
scene.add(model);


async function initScene() {
	shader = new Shader(gl, pbrVert, pbrFrag);
	// shader = new Shader(gl, phongVert, phongFrag);
	// shader = new Shader(gl, blinnPhongVert, blinnPhongFrag);

	shader.use();

	shader.attributes.pos.bind(vertices).pointer();
	shader.attributes.normal.bind(normals).pointer();
	shader.attributes.uv.bind(uvs).pointer();

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	shader.uniforms.alpha = 1;

	shader.uniforms.metallic = 0.5;
	shader.uniforms.roughness = 0.5;
	shader.uniforms.ao = 1.0;
	shader.uniforms.albedo = albedoColor.toArray();

	const basecolor = await RES.loadImage("./assets/rustediron1/albedo.png");
	const normal = await RES.loadImage("./assets/rustediron1/normal.png");
	const metallic = await RES.loadImage("./assets/rustediron1/metallic.png");
	const roughness = await RES.loadImage("./assets/rustediron1/roughness.png");

	gl.activeTexture(gl.TEXTURE0);
	const basecolorTexture = new Texture(gl, basecolor).bind();

	gl.activeTexture(gl.TEXTURE1);
	const normalTexture = new Texture(gl, normal).bind();

	gl.activeTexture(gl.TEXTURE2);
	const metallicTexture = new Texture(gl, metallic).bind();

	gl.activeTexture(gl.TEXTURE3);
	const roughnessTexture = new Texture(gl, roughness).bind();

	shader.uniforms.u_texture = 0;
	shader.uniforms.map = 0;
	shader.uniforms.normalMap = 1;
	shader.uniforms.metallicMap = 2;
	shader.uniforms.roughnessMap = 3;

	loop();
}

function loop() {
	requestAnimationFrame(loop);

	model.rotationY += 1;

	camera._update();
	scene._update();

	const vp = camera.projectionMatrix.clone().multiply(camera.worldMatrix.clone().invert());

	shader.uniforms.vp = vp.toArray();

	shader.uniforms.viewPos = camera.position.toArray();

	shader.uniforms.lightPos = lightPos.toArray();
	shader.uniforms.lightColor = lightColor.toArray();

	shader.uniforms.model = model.worldMatrix.toArray();

	const normalMat = model.worldMatrix.clone().invert().transpose();
	shader.uniforms.normalMat = normalMat.toArray();

	shader.uniforms.color = color(1, 1, 1).toArray();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}

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
