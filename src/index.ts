/*
 * index.js
 * Created by 还有醋v on 2022/2/25.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */


import { PerspectiveCamera } from "./Camera/PerspectiveCamera";
import { Mesh3D } from "./core/Mesh3D";
import { Scene } from "./core/Scene";
import { WebGLRender } from "./core/WebGLRender";
import { BoxGeometry } from "./Geometry/BoxGeometry";
import { SphereGeometry } from "./Geometry/SphereGeometry";
import { PointLight } from "./Light/PointLight";
import { CustomMaterial } from "./Material/CustomMaterial";
import { PbrMaterial } from "./Material/PbrMaterial";
import { color, v3 } from "./math";
import { Texture } from "./Shader/Texture";
import { RES } from "./Tools/RES";

// 测试自定义材质
import testFrag from "./shaders/testCusShader.frag";
import testVert from "./shaders/testCusShader.vert";

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

const camera = new PerspectiveCamera(60, viewW / viewH, 0.1, 1000);
// camera.position.set(1, 0, 4);
camera.position.set(0, 0, 10);
camera.updateWorldMatrix();
camera.lookAt(v3());

const scene = new Scene();

let mesh: Mesh3D;
let mesh2: Mesh3D;
let mesh3: Mesh3D;
let pLight: PointLight;
let uniform;

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
	pLight = new PointLight();
	pLight.position.set(0, 0, 1.0);
	scene.add(pLight);

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			scene.add(new Mesh3D(
				new SphereGeometry(0.5, 30, 30),
				new PbrMaterial({
					roughness: 0.1 * i,
					ao: 1.0,
					alpha: 0.5,
					metallic: 0.1 * j,
					color: color(1, 0, 0),
				}),
			)).position.set(i * 1.1 - 5, j * 1.1 - 5, 0);
		}
	}

	// pbr
	mesh = new Mesh3D(
		new SphereGeometry(0.5, 30, 30),
		new PbrMaterial({
			// map: basecolorTexture,
			// normalMap: normalTexture,
			// metallicMap: metallicTexture,
			// roughnessMap: roughnessTexture,
			color: color(1, 1, 0),
		}),
	);

	// 自定义材质，加了个边缘光
	uniform = {
		// map: basecolor1Texture,
		// normalMap: normal1Texture,
		// metallicMap: metallic1Texture,
		// roughnessMap: roughness1Texture,
		// aoMap: ao1Texture,
		colorRim: color(0, 1, 0),
		rimPow: 3.2,
	}

	mesh2 = new Mesh3D(
		new SphereGeometry(0.5, 30, 30),
		new CustomMaterial(testVert, testFrag, uniform),
	);

	// pbr 带透明
	mesh3 = new Mesh3D(
		new BoxGeometry(),
		new PbrMaterial({
			// map: basecolor1Texture,
			// normalMap: normal1Texture,
			// metallicMap: metallic1Texture,
			// roughnessMap: roughness1Texture,
			// aoMap: ao1Texture,
			// alpha: 0.5,
		}),
	);

	// mesh3.material.alpha = 0.5;

	mesh.position.set(0, 1.5, 0);
	mesh2.position.set(0, 0, 0);
	mesh3.position.set(0, -1.5, 0);

	// scene.add(mesh);
	// scene.add(mesh2);
	// scene.add(mesh3);


	loop();
}

let dir = 1;

function loop() {
	requestAnimationFrame(loop);

	mesh.rotationY += 1;
	mesh2.rotationY -= 1;
	mesh3.rotationY -= 1;

	pLight.y += 0.1 * dir;
	pLight.x += 0.1 * dir;
	if (Math.abs(pLight.y) > 4.5) {
		dir *= -1;
	}
	// if (Math.abs(pLight.x) > 2) {
	// 	dir *= -1;
	// }

	render.render(scene, camera);
}

initScene();

import { GUI } from 'dat.gui';

const param = {
	rotationX: 0,
	rimColor: {
		r: 0,
		g: 1,
		b: 0,
	},
	rimPow: 3.2,
	metallic: 0.5,
	roughness: 0.5,
	ao: 1.0,
}

const gui = new GUI();
gui.add(param, "rimPow", 1, 5, 0.1).onChange((e) => {
	uniform.rimPow = e;
});
gui.add(param, "metallic", 0, 1, 0.1).onChange((e) => {
	(mesh.material as PbrMaterial).metallic = e;
	(mesh3.material as PbrMaterial).metallic = e;
});
gui.add(param, "roughness", 0, 1, 0.1).onChange((e) => {
	(mesh.material as PbrMaterial).roughness = e;
	(mesh3.material as PbrMaterial).roughness = e;

});
gui.add(param, "ao", 0, 1, 0.1).onChange((e) => {
	(mesh.material as PbrMaterial).ao = e;
	(mesh3.material as PbrMaterial).ao = e;
});

const lightPosGui = gui.addFolder("边缘光颜色");
lightPosGui.add(param.rimColor, "r", 0, 1, 0.1).onChange((e) => {
	uniform.colorRim.r = e;
});
lightPosGui.add(param.rimColor, "g", 0, 1, 0.1).onChange((e) => {
	uniform.colorRim.g = e;
});
lightPosGui.add(param.rimColor, "b", 0, 1, 0.1).onChange((e) => {
	uniform.colorRim.b = e;
});
