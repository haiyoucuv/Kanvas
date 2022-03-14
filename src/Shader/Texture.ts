/*
 * Texture.ts
 * Created by 还有醋v on 2021/12/17.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import { WebGLRender } from "../core/WebGLRender";
import { createTexture } from "./glTools";

export class Texture {

	private _glTexture: WebGLTexture = null;

	_width: number = 0;
	get width(): number {
		return this._width;
	}

	_height: number = 0;
	get height(): number {
		return this._height;
	}

	get glTexture(): WebGLTexture {
		return this._glTexture;
	}

	private gl: WebGLRenderingContext;

	private image: HTMLImageElement | HTMLCanvasElement;

	constructor(image: HTMLImageElement | HTMLCanvasElement) {
		this.gl = WebGLRender.gl;
		this.image = image;
		this._width = image.width;
		this._height = image.height;
		this._glTexture = createTexture(this.gl, image);
	}

	bind(unit: GLenum = this.gl.TEXTURE0) {
		this.gl.activeTexture(unit);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this._glTexture);
		return this;
	}

}
