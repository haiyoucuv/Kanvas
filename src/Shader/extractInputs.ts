/*
 * extractInputs.ts
 * Created by 还有醋v on 2021/12/17.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import Attribute from "./Attribute";
import { defaultValue } from "./defaultValue";
import { mapType } from "./glMap";

export function extractAttributes(gl: WebGLRenderingContext, program: WebGLProgram): { [key in string]: Attribute } {

	const attributes: { [key in string]: Attribute } = {};

	const attributeCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

	for (let i = 0; i < attributeCount; i++) {
		const attributeData = gl.getActiveAttrib(program, i);
		const { size, type, name } = attributeData;
		attributes[name] = Attribute.create(gl, program, attributeData);
	}

	return attributes;
}

export function extractUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
	const uniforms = {};

	const totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

	for (let i = 0; i < totalUniforms; i++) {
		const uniformData: WebGLActiveInfo = gl.getActiveUniform(program, i);
		const name = uniformData.name.replace(/\[.*?\]/, "");
		const type = mapType(gl, uniformData.type);

		uniforms[name] = {
			type: type,
			size: uniformData.size,
			location: gl.getUniformLocation(program, name),
			value: defaultValue(type, uniformData.size)
		};
	}

	return uniforms;
}
