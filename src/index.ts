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
import { PointLight } from "./Light/PointLight";
import { PbrMaterial } from "./Material/PbrMaterial";
import { color, v3 } from "./math";
import Shader from "./Shader/Shader";
import { Texture } from "./Shader/Texture";
import { RES } from "./Tools/RES";

const { innerWidth: winW, innerHeight: winH, devicePixelRatio: dip = 1 } = window;
const viewW = winW * dip;
const viewH = winH * dip;

const canvas = document.createElement("canvas");
canvas.width = viewW;
canvas.height = viewH;
canvas.style.width = "100%";
canvas.style.height = "100%";
document.body.appendChild(canvas);

const render = new WebGLRender(canvas);

const camera = new PerspectiveCamera(60, viewW / viewH, 1, 1000);
camera.position.set(1, 0, 4);
camera.updateWorldMatrix();
camera.lookAt(v3());

const scene = new Scene();

let mesh;
let mesh2;

async function initScene() {

	const basecolor = await RES.loadImage("./assets/rustediron1/albedo.png");
	const normal = await RES.loadImage("./assets/rustediron1/normal.png");
	const metallic = await RES.loadImage("./assets/rustediron1/metallic.png");
	const roughness = await RES.loadImage("./assets/rustediron1/roughness.png");

	const basecolor1 = await RES.loadImage("./assets/dented-metal/albedo.png");
	const normal1 = await RES.loadImage("./assets/dented-metal/normal.png");
	const metallic1 = await RES.loadImage("./assets/dented-metal/metallic.png");
	const roughness1 = await RES.loadImage("./assets/dented-metal/roughness.png");
	const ao1 = await RES.loadImage("./assets/dented-metal/ao.png");

	const basecolorTexture = new Texture(basecolor);
	const normalTexture = new Texture(normal);
	const metallicTexture = new Texture(metallic);
	const roughnessTexture = new Texture(roughness);

	const basecolor1Texture = new Texture(basecolor1);
	const normal1Texture = new Texture(normal1);
	const metallic1Texture = new Texture(metallic1);
	const roughness1Texture = new Texture(roughness1);
	const ao1Texture = new Texture(ao1);

	// 灯光
	const pLight = new PointLight();
	pLight.position.set(0, 0, 1);
	scene.add(pLight);


	mesh = new Mesh3D(
		new SphereGeometry(0.5, 30, 30),
		new PbrMaterial({
			map: basecolorTexture,
			normalMap: normalTexture,
			metallicMap: metallicTexture,
			roughnessMap: roughnessTexture,
		}),
	);

	mesh2 = new Mesh3D(
		new BoxGeometry(),
		new PbrMaterial({
			map: basecolor1Texture,
			normalMap: normal1Texture,
			metallicMap: metallic1Texture,
			roughnessMap: roughness1Texture,
			aoMap: ao1Texture,
			alpha: 0.5,
		}),
	);

	mesh.position.set(0.3, 0, 0);
	mesh2.position.set(0, 0, 0);

	scene.add(mesh);
	scene.add(mesh2);


	loop();
}

function loop() {
	requestAnimationFrame(loop);

	mesh.rotationY += 1;
	mesh2.rotationY -= 1;

	render.render(scene, camera);
}

initScene();

import { GUI } from 'dat.gui';

const param = {
	rotationX: 0, rotationY: 0, rotationZ: 0
}

const gui = new GUI();
gui.add(param, "rotationX", 0, 360, 1).onChange((e) => {
	mesh2.rotationX = e;
});
gui.add(param, "rotationY", 0, 360, 1).onChange((e) => {
	mesh2.rotationY = e;
});
gui.add(param, "rotationZ", 0, 360, 1).onChange((e) => {
	mesh2.rotationZ = e;
});

// const lightPosGui = gui.addFolder("lightPos");
// lightPosGui.add(param.lightPos, "x", -5, 5, 0.1).onChange((e) => {
// 	lightPos.x = e;
// });
// lightPosGui.add(param.lightPos, "y", -5, 5, 0.1).onChange((e) => {
// 	lightPos.y = e;
// });
// lightPosGui.add(param.lightPos, "z", -5, 5, 0.1).onChange((e) => {
// 	lightPos.z = e;
// });
