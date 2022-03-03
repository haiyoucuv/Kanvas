/*
 * glMap.ts
 * Created by 还有醋v on 2021/12/17.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */


export function mapType(gl, type) {
	if (!GL_TABLE) {
		const typeNames = Object.keys(GL_TYPES);

		GL_TABLE = {};

		for (let i = 0; i < typeNames.length; ++i) {
			const tn = typeNames[i];
			GL_TABLE[gl[tn]] = GL_TYPES[tn];
		}
	}

	return GL_TABLE[type];
}

let GL_TABLE = null;

const GL_TYPES = {
	'FLOAT': 'float',
	'FLOAT_VEC2': 'vec2',
	'FLOAT_VEC3': 'vec3',
	'FLOAT_VEC4': 'vec4',

	'UNSIGNED_INT': 'uint',
	'INT': 'int',
	'INT_VEC2': 'ivec2',
	'INT_VEC3': 'ivec3',
	'INT_VEC4': 'ivec4',

	'BOOL': 'bool',
	'BOOL_VEC2': 'bvec2',
	'BOOL_VEC3': 'bvec3',
	'BOOL_VEC4': 'bvec4',

	'FLOAT_MAT2': 'mat2',
	'FLOAT_MAT3': 'mat3',
	'FLOAT_MAT4': 'mat4',

	'SAMPLER_2D': 'sampler2D',
	'SAMPLER_CUBE': 'samplerCube',
};


export function mapSize(type: string): number {
	return GL_SIZE[type];
}


const GL_SIZE = {
	'float': 1,
	'vec2': 2,
	'vec3': 3,
	'vec4': 4,

	'int': 1,
	'ivec2': 2,
	'ivec3': 3,
	'ivec4': 4,

	'bool': 1,
	'bvec2': 2,
	'bvec3': 3,
	'bvec4': 4,

	'mat2': 4,
	'mat3': 9,
	'mat4': 16,

	'sampler2D': 1
};
