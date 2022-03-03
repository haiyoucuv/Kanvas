/*
 * Created by 还有醋v on 2020/9/8.
 * Copyright © 2020 haiyoucuv. All rights reserved.
 */

import { mapType, mapSize } from "./glMap";

export default class Attribute {

	public name: string;
	public size: number;
	public type: string;

	public location: GLint;

	public buffer: WebGLBuffer;
	private _bufferData = null;

	public set bufferData(bufferData) {
		this._bufferData = bufferData;
	}

	public get bufferData() {
		return this._bufferData;
	}

	private constructor(
		public gl: WebGLRenderingContext,
		public program: WebGLProgram,
		attribData: WebGLActiveInfo,
	) {
		this.name = attribData.name;
		this.type = mapType(gl, attribData.type);
		this.size = mapSize(this.type);
	}

	public static create(
		gl: WebGLRenderingContext,
		program: WebGLProgram,
		attribData: WebGLActiveInfo
	): Attribute {
		return (new Attribute(gl, program, attribData)).init();
	}

	public init(): this {
		const gl = this.gl;
		this.buffer = gl.createBuffer();
		this.location = gl.getAttribLocation(this.program, this.name);
		this.enable();
		return this;
	}

	public enable() {
		this.gl.enableVertexAttribArray(this.location);

		return this;
	}

	public disable() {
		this.gl.disableVertexAttribArray(this.location);

		return this;
	}

	public bind(bufferData) {
		bufferData && (this._bufferData = bufferData);
		const gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._bufferData, gl.STATIC_DRAW);

		return this;
	}

	public pointer(type = this.gl.FLOAT, normalized = false, stride = 0, start = 0) {
		this.gl.vertexAttribPointer(this.location, this.size, type, normalized, stride, start);

		return this;
	}

}
