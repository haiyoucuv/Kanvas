/**
 * 使uniform能通过赋值直接和着色器程序通信
 * @class
 * @memberof glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param uniformData
 * @return attributes {Object}
 */
export function generateUniformAccessObject(gl:WebGLRenderingContext, uniformData) {
    // this is the object we will be sending back.
    // an object hierachy will be created for structs
    const uniforms = {
		gl,
		data: {},
	};

    const uniformKeys = Object.keys(uniformData);

    for (let i = 0; i < uniformKeys.length; i++) {
        const fullName = uniformKeys[i];

        const nameTokens = fullName.split('.');
        const name = nameTokens[nameTokens.length - 1];


        const uniformGroup = getUniformGroup(nameTokens, uniforms);

        const uniform = uniformData[fullName];
        uniformGroup.data[name] = uniform;

        uniformGroup.gl = gl;

        Object.defineProperty(uniformGroup, name, {
            get: generateGetter(name),
            set: generateSetter(name, uniform)
        });
    }

    return uniforms;
}

const generateGetter = function (name) {
    return function () {
        return this.data[name].value;
    };
};

const GLSL_SINGLE_SETTERS = {
    float: function setSingleFloat(gl, location, value) { gl.uniform1f(location, value); },
    vec2: function setSingleVec2(gl, location, value) { gl.uniform2f(location, value[0], value[1]); },
    vec3: function setSingleVec3(gl, location, value) { gl.uniform3f(location, value[0], value[1], value[2]); },
    vec4: function setSingleVec4(gl, location, value) { gl.uniform4f(location, value[0], value[1], value[2], value[3]); },

    int: function setSingleInt(gl, location, value) { gl.uniform1i(location, value); },
    ivec2: function setSingleIvec2(gl, location, value) { gl.uniform2i(location, value[0], value[1]); },
    ivec3: function setSingleIvec3(gl, location, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    ivec4: function setSingleIvec4(gl, location, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },

    bool: function setSingleBool(gl, location, value) { gl.uniform1i(location, value); },
    bvec2: function setSingleBvec2(gl, location, value) { gl.uniform2i(location, value[0], value[1]); },
    bvec3: function setSingleBvec3(gl, location, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    bvec4: function setSingleBvec4(gl, location, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },

    mat2: function setSingleMat2(gl, location, value) { gl.uniformMatrix2fv(location, false, value); },
    mat3: function setSingleMat3(gl, location, value) { gl.uniformMatrix3fv(location, false, value); },
    mat4: function setSingleMat4(gl, location, value) { gl.uniformMatrix4fv(location, false, value); },

    sampler2D: function setSingleSampler2D(gl, location, value) { gl.uniform1i(location, value); },
};

const GLSL_ARRAY_SETTERS = {
    float: function setFloatArray(gl, location, value) { gl.uniform1fv(location, value); },
    vec2: function setVec2Array(gl, location, value) { gl.uniform2fv(location, value); },
    vec3: function setVec3Array(gl, location, value) { gl.uniform3fv(location, value); },
    vec4: function setVec4Array(gl, location, value) { gl.uniform4fv(location, value); },
    int: function setIntArray(gl, location, value) { gl.uniform1iv(location, value); },
    ivec2: function setIvec2Array(gl, location, value) { gl.uniform2iv(location, value); },
    ivec3: function setIvec3Array(gl, location, value) { gl.uniform3iv(location, value); },
    ivec4: function setIvec4Array(gl, location, value) { gl.uniform4iv(location, value); },
    bool: function setBoolArray(gl, location, value) { gl.uniform1iv(location, value); },
    bvec2: function setBvec2Array(gl, location, value) { gl.uniform2iv(location, value); },
    bvec3: function setBvec3Array(gl, location, value) { gl.uniform3iv(location, value); },
    bvec4: function setBvec4Array(gl, location, value) { gl.uniform4iv(location, value); },
    sampler2D: function setSampler2DArray(gl, location, value) { gl.uniform1iv(location, value); },
};

function generateSetter(name, uniform) {
    return function (value) {
        this.data[name].value = value;
	    const location = this.data[name].location;
	    if (uniform.size === 1) {
            GLSL_SINGLE_SETTERS[uniform.type](this.gl, location, value);
        }
        else {
            // glslSetArray(gl, location, type, value) {
            GLSL_ARRAY_SETTERS[uniform.type](this.gl, location, value);
        }
    };
}

function getUniformGroup(nameTokens, uniform) {
    let cur = uniform;

    for (let i = 0; i < nameTokens.length - 1; i++) {
        const o = cur[nameTokens[i]] || { data: {} };
        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
}



