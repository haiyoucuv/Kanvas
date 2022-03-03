import { Matrix4 } from "./Matrix4";
// import { Camera } from "../camera";
import { Matrix3 } from "./Matrix3";

export class Vector3 {
    constructor(
        public x: number = 0,
        public y: number = x,
        public z: number = x
    ) {
    }

    public static get ZERO() {
        return new Vector3();
    }

    public static get ONE() {
        return new Vector3(1);
    }

    public static get UP() {
        return new Vector3(0, 1, 0);
    }

    public static get RIGHT() {
        return new Vector3(1, 0, 0);
    }

    static get FORWARD() {
        return new Vector3(0, 0, 1);
    }

    public zero() {
        this.x = this.y = this.z = 0;
        return this;
    }

    public one() {
        this.x = this.y = this.z = 1;
        return this;
    }

    public up() {
        this.x = this.y = 0;
        this.z = 1;
        return this;
    }

    public right() {
        this.x = this.z = 0;
        this.y = 1;
        return this;
    }

    public forward() {
        this.x = this.y = 0;
        this.z = 1;
        return this;
    }

    public set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this
    }

    public copy(v: Vector3): this {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this
    }

    public clone(): Vector3 {
        return new Vector3().copy(this);
    }

    public add(v: Vector3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    public addScalar(s: number) {

        this.x += s;
        this.y += s;
        this.z += s;

        return this;

    }

    public addVectors(a: Vector3, b: Vector3) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    public addScaledVector(v: Vector3, s: number) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
    }

    public sub(v: Vector3) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;

    };

    public subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    };

    public subVectors(a: Vector3, b: Vector3) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };

    public multiplyScalar(scalar: number) {

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;

    };

    public multiplyVectors(a: Vector3, b: Vector3) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    };

    public divide(v: Vector3) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    };

    public divideScalar(scalar: number) {
        return this.multiplyScalar(1 / scalar);
    };

    public cross(v: Vector3) {
        return this.crossVectors(this, v);
    };

    public crossVectors(a: Vector3, b: Vector3) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };

    public dot(v: Vector3) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * 长度
     */
    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * 标准化，长度为1
     */
    public normalize() {
        const scalar = 1 / (this.length() || 1);
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    public distanceTo(v: Vector3) {
        return Math.sqrt(this.distanceToSquared(v));
    };

    public distanceToSquared(v: Vector3) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    };

    public min(v: Vector3) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
    };

    public max(v: Vector3) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    };

    public clamp(min: Vector3, max: Vector3) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    };

    public clampScalar(minVal: number, maxVal: number) {
        return this.clamp(new Vector3(minVal, minVal, minVal), new Vector3(maxVal, maxVal, maxVal));
    }

    public clampLength(min: number, max: number) {
        return this.divideScalar(this.length() || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    };

    /**
     * applyMatrix4
     * @param m
     */
    public applyMatrix4(m: Matrix4) {
        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
    };

    /**
     * applyMatrix3
     * @param m
     */
    public applyMatrix3(m: Matrix3) {
        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]);
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]);
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]);
        return this;
    };

    /**
     * 从矩阵获得位置
     * @param m
     */
    public setFromMatrixPosition(m: Matrix4) {
        const e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    };

    /**
     * 从矩阵获得缩放值
     * @param m
     */
    public setFromMatrixScale(m: Matrix4) {
        const sx = this.setFromMatrixColumn(m, 0).length();
        const sy = this.setFromMatrixColumn(m, 1).length();
        const sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    }

    public setFromMatrixColumn(m: Matrix4, index: number) {
        return this.fromArray(m.elements, index * 4);
    };

    public transformDirection(m: Matrix4) {
        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
    };

    // /**
    //  * 转换成屏幕坐标，范围-1到1，可根据stage转换成stage上坐标，或者canvas坐标
    //  * @param camera
    //  */
    // public project(camera: Camera) {
    //     return this.applyMatrix4(camera.worldMatrixInverse).applyMatrix4(camera.projectionMatrix);
    // };
	//
    // public unproject(camera: Camera) {
    //     return this.applyMatrix4(new Matrix4().setInverseOf(camera.projectionMatrix)).applyMatrix4(camera.worldMatrix);
    // };


    public equals(v: Vector3) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    }

    public fromArray(array: number[] | Float32Array, offset: number = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    };

    public toArray(array: number[] = [], offset: number = 0) {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
    };
}

/**
 * 一个快速创建的方法
 * @returns {Vector3}
 */
export function v3(x: number = 0, y: number = x, z: number = x) {
    return new Vector3(x, y, z);
}
