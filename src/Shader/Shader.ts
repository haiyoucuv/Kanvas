/*
 * Shader.ts
 * Created by 还有醋v on 2021/12/17.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import { initProgram } from "./glTools";
import Attribute from "./Attribute";
import { extractAttributes, extractUniforms } from "./extractInputs";
import { generateUniformAccessObject } from "./generateUniformAccessObject";

export default class Shader {

	private gl: WebGLRenderingContext;

	/**
	 * vsShader
	 */
	public vs: string;

	/**
	 * fsShader
	 */
	public fs: string;


	private readonly _program: WebGLProgram = null;
	get program(): WebGLProgram {
		return this._program;
	}

	private readonly _attributes: { [key in string]: Attribute };
	get attributes() {
		return this._attributes;
	}

	private readonly _uniformData;
	get uniformData() {
		return this._uniformData;
	}

	uniforms;

	indexBuffer: WebGLBuffer = null;

	constructor(gl: WebGLRenderingContext, vs: string, fs: string) {
		this.gl = gl;
		this.vs = vs;
		this.fs = fs;

		this._program = initProgram(gl, vs, fs);

		this._attributes = extractAttributes(gl, this.program);

		this._uniformData = extractUniforms(gl, this.program);

		this.uniforms = generateUniformAccessObject(gl, this._uniformData);

		this.indexBuffer = gl.createBuffer();
	}

	/**
	 * 使用着色器程序
	 */
	use(): this {
		this.gl.useProgram(this._program);
		return this;
	}

}
