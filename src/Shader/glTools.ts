/*
 * glTools.ts
 * Created by 还有醋v on 2021/12/15.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */


/**
 * 初始化一个gl程序
 * @param {WebGLRenderingContext} gl
 * @param {string} vs
 * @param {string} fs
 * @return {WebGLProgram}
 */
export function initProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
    const vsShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fsShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

    if (!(vsShader && fsShader)) {
        throw "创建shader程序失败";
    }

    const program = createProgram(gl, vsShader, fsShader);
    if (!program) {
        throw "链接着色器程序失败";
    }
    return program;

}

/**
 * 创建shader程序
 * @param {WebGLRenderingContext} gl
 * @param {GLenum} type
 * @param {string} source
 * @return {WebGLShader | null}
 */
export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * 链接着色器程序
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragShader
 * @return {WebGLProgram}
 */
export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragShader: WebGLShader): WebGLProgram {

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

/**
 * 创建webgl贴图
 * @param {WebGLRenderingContext} gl
 * @param {TexImageSource} image
 * @return {WebGLTexture}
 */
export function createTexture(gl: WebGLRenderingContext, image: TexImageSource): WebGLTexture {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}
