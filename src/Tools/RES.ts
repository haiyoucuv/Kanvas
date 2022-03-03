/*
 * RES.ts
 * Created by 还有醋v on 2021/12/21.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import { Texture } from "../Shader/Texture";

export class RES {

	/**
	 * 图片缓存
	 * @type {{[key in string]: HTMLImageElement}}
	 */
	static IMAGE_CACHE: { [key in string]: HTMLImageElement } = {};

	/**
	 * 加载图片
	 * @param {string} src
	 * @return {Promise<HTMLImageElement>}
	 */
	static async loadImage(src: string): Promise<HTMLImageElement> {
		if (RES.IMAGE_CACHE[src]) return RES.IMAGE_CACHE[src];
		return new Promise((resolve) => {
			const image = new Image();
			image.onload = () => {
				RES.IMAGE_CACHE[src] = image;
				resolve(image);
			};
			image.onerror = () => resolve(null);
			image.src = src;
		});
	}

}
