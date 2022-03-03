/*
 * Created by 还有醋v on 2020/9/8.
 * Copyright © 2020 haiyoucuv. All rights reserved.
 */

let _lut = [];
for (let i = 0; i < 256; i++) {
    _lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}


export class _Math {
    public static DEG2RAD = Math.PI / 180;
    public static RAD2DEG = 180 / Math.PI;

    constructor() {
    }

    public static generateUUID() {

        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

         const d0 = Math.random() * 0xffffffff | 0;
         const d1 = Math.random() * 0xffffffff | 0;
         const d2 = Math.random() * 0xffffffff | 0;
         const d3 = Math.random() * 0xffffffff | 0;
         const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
            _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
            _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
            _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

        // .toUpperCase() here flattens concatenated strings to save heap memory space.
        return uuid.toUpperCase();

    }

    public static clamp(value, min, max) {

        return Math.max(min, Math.min(max, value));

    }

    // compute euclidian modulo of m % n
    // https://en.wikipedia.org/wiki/Modulo_operation

    public static euclideanModulo(n, m) {

        return ((n % m) + m) % m;

    }

    // Linear mapping from range <a1, a2> to range <b1, b2>

    public static mapLinear(x, a1, a2, b1, b2) {

        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);

    }

    // https://en.wikipedia.org/wiki/Linear_interpolation

    public static lerp(x, y, t) {

        return (1 - t) * x + t * y;

    }

    // http://en.wikipedia.org/wiki/Smoothstep

    public static smoothstep(x, min, max) {

        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * (3 - 2 * x);

    }

    public static smootherstep(x, min, max) {

        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * x * (x * (x * 6 - 15) + 10);

    }

    // Random integer from <low, high> interval

    public static randInt(low, high) {

        return low + Math.floor(Math.random() * (high - low + 1));

    }

    // Random float from <low, high> interval

    public staticrandFloat(low, high) {

        return low + Math.random() * (high - low);

    }

    // Random float from <-range/2, range/2> interval

    public static randFloatSpread(range) {

        return range * (0.5 - Math.random());

    }

    public static degToRad(degrees) {

        return degrees * _Math.DEG2RAD;

    }

    public static radToDeg(radians) {

        return radians * _Math.RAD2DEG;

    }

    public static isPowerOfTwo(value) {

        return (value & (value - 1)) === 0 && value !== 0;

    }

    public static ceilPowerOfTwo(value) {

        return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));

    }

    public static floorPowerOfTwo(value) {

        return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));

    }

}

