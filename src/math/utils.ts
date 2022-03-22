/*
 * utils.ts
 * Created by 还有醋v on 2022/3/7.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

export const PI = Math.PI;
export const PI2 = Math.PI * 2;

/**
 * 弧度转角度
 * @static
 * @constant
 * @type {number}
 */
export const RAD_TO_DEG: number = 180 / PI;

export function radToDeg(rad) {
	return rad * RAD_TO_DEG;
}


/**
 * 角度转弧度
 * @static
 * @constant
 * @type {number}
 */
export const DEG_TO_RAD: number = PI / 180;

export function degToRad(deg) {
	return deg * DEG_TO_RAD;
}


/**
 * 取符合范围的值
 * @param value
 * @param min
 * @param max
 */
export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}
