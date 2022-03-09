/*
 * Object3D.ts
 * Created by 还有醋v on 2022/3/2.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import { deg2Rad, euler, Euler, mat4, Matrix4, quat, Quaternion, rad2Deg, RotationOrders, v3, Vector3 } from "../math";

export class Object3D {

	position: Vector3 = v3();
	scale: Vector3 = v3(1, 1, 1);
	rotation: Euler = euler();
	readonly quaternion: Quaternion = quat().setFromEuler(this.rotation);

	// 矩阵
	worldMatrix: Matrix4 = mat4();
	localMatrix: Matrix4 = mat4();

	parent: Object3D = null;
	children: Object3D[] = [];

	constructor() {
		this.quaternion.onChange(this.onQuaternionChange);
		this.rotation.onChange(this.onRotationChange);
	}

	onQuaternionChange = () => {
		this.rotation.setFromQuaternion(this.quaternion, void 0, false);
	}

	onRotationChange = () => {
		this.quaternion.setFromEuler(this.rotation, false);
	}


	add<T extends Object3D>(object: T): T {

		object.parent && object.remove(object);

		object.parent = this;

		this.children.push(object);

		return object;

	}

	remove<T extends Object3D>(object: T): T {

		if (object.parent !== this) return;

		const index = this.children.indexOf(object);

		this.children.splice(index, 1);

		object.parent = null;

		return object;

	}

	updateLocalMatrix() {
		const {
			localMatrix,
			position,
			quaternion,
			scale,
		} = this;
		localMatrix.compose(position, quaternion, scale);
	}

	updateWorldMatrix() {
		this.updateLocalMatrix();

		const {
			worldMatrix,
			localMatrix,
			parent
		} = this;

		if (parent) {
			worldMatrix.multiplyMatrices(parent.worldMatrix, localMatrix);
		} else {
			worldMatrix.copy(localMatrix);
		}
	}

	onUpdate() {

	}

	// 数据更新
	_update() {
		const { children } = this;

		this.onUpdate();

		this.updateWorldMatrix();   // 先更新自己的世界矩阵

		const len = children.length;
		for (let i = 0; i < len; i++) {
			children[i]._update();
		}
	}

	lookAt(target: Vector3) {
		this.updateWorldMatrix();

		const mat4 = new Matrix4();

		if (this["isCamera"]) {
			mat4.lookAt(this.position, target, Vector3.UP);
		} else {
			mat4.lookAt(target, this.position, Vector3.UP);
		}

		this.quaternion.setFromRotationMatrix(mat4);

	}


	get x() {
		return this.position.x;
	}

	set x(v: number) {
		this.position.x = v;
	}

	get y() {
		return this.position.y;
	}

	set y(v: number) {
		this.position.y = v;
	}

	get z() {
		return this.position.z;
	}

	set z(v: number) {
		this.position.z = v;
	}

	get scaleX() {
		return this.scale.x;
	}

	set scaleX(v: number) {
		this.scale.x = v;
	}

	get scaleY() {
		return this.scale.y;
	}

	set scaleY(v: number) {
		this.scale.y = v;
	}

	get scaleZ() {
		return this.scale.z;
	}

	set scaleZ(v: number) {
		this.scale.z = v;
	}

	get rotationX() {
		return rad2Deg(this.rotation.x);
	}

	set rotationX(v: number) {
		this.rotation.x = deg2Rad(v);
		// this.rotation.x = v;
	}

	get rotationY() {
		return rad2Deg(this.rotation.y);
	}

	set rotationY(v: number) {
		this.rotation.y = deg2Rad(v);
		// this.rotation.y = v;
	}

	get rotationZ() {
		return rad2Deg(this.rotation.z);
	}

	set rotationZ(v: number) {
		this.rotation.z = deg2Rad(v);
		// this.rotation.z = v;
	}


}
