import { Vector3 } from './Vector3';
import { clamp } from "./utils";

export class Quaternion {
    private _x: number
    private _y: number
    private _z: number
    private _w: number

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    public static slerp(qa, qb, qm, t) {
        return qm.copy(qa).slerp(qb, t);
    }

    public static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

        // fuzz-free, array-based Quaternion SLERP operation

        let x0 = src0[srcOffset0 + 0],
            y0 = src0[srcOffset0 + 1],
            z0 = src0[srcOffset0 + 2],
            w0 = src0[srcOffset0 + 3],

            x1 = src1[srcOffset1 + 0],
            y1 = src1[srcOffset1 + 1],
            z1 = src1[srcOffset1 + 2],
            w1 = src1[srcOffset1 + 3];

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

            let s = 1 - t,

                cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

                dir = (cos >= 0 ? 1 : -1),
                sqrSin = 1 - cos * cos;

            // Skip the Slerp for tiny steps to avoid numeric problems:
            if (sqrSin > /*Number.EPSILON*/0.0000000000000000001) {

                const sin = Math.sqrt(sqrSin),
                    len = Math.atan2(sin, cos * dir);

                s = Math.sin(s * len) / sin;
                t = Math.sin(t * len) / sin;

            }

            const tDir = t * dir;

            x0 = x0 * s + x1 * tDir;
            y0 = y0 * s + y1 * tDir;
            z0 = z0 * s + z1 * tDir;
            w0 = w0 * s + w1 * tDir;

            // Normalize in case we just did a lerp:
            if (s === 1 - t) {

                const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

                x0 *= f;
                y0 *= f;
                z0 *= f;
                w0 *= f;

            }

        }

        dst[dstOffset] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;

    }

    get x(): number {
        return this._x
    }

    set x(value) {
        this._x = value;
        this.onChangeCallback();
    }

    get y(): number {
        return this._y
    }

    set y(value) {
        this._y = value;
        this.onChangeCallback();
    }

    get z(): number {
        return this._z
    }

    set z(value) {
        this._z = value;
        this.onChangeCallback();
    }

    get w(): number {
        return this._w
    }

    set w(value) {
        this._w = value;
        this.onChangeCallback();
    }

    set(x, y, z, w) {

        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
        this.onChangeCallback();
        return this;
    }

    clone() {

        return new Quaternion(this._x, this._y, this._z, this._w);
    }

    copy(quaternion) {

        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;

        this.onChangeCallback();

        return this;

    }

    setFromEuler(euler, update = true) {

        const x = euler._x, y = euler._y, z = euler._z, order = euler.order;

        const cos = Math.cos;
        const sin = Math.sin;

        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);

        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);

        if (order === 'XYZ') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if (order === 'YXZ') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if (order === 'ZXY') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if (order === 'ZYX') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if (order === 'YZX') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if (order === 'XZY') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        }

        if (update) this.onChangeCallback();

        return this;

    }

    setFromAxisAngle(axis, angle) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

        // assumes axis is normalized

        const halfAngle = angle / 2, s = Math.sin(halfAngle);

        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos(halfAngle);

        this.onChangeCallback();

        return this;

    }

    setFromRotationMatrix(m) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        const te = m.elements,
            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],
            trace = m11 + m22 + m33;

        let s;

        if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);

            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;

        } else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this._w = (m32 - m23) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21) / s;
            this._z = (m13 + m31) / s;

        } else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;

        } else {

            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this._w = (m21 - m12) / s;
            this._x = (m13 + m31) / s;
            this._y = (m23 + m32) / s;
            this._z = 0.25 * s;

        }

        this.onChangeCallback();

        return this;

    }

    setFromUnitVectors = function() {

        // assumes direction vectors vFrom and vTo are normalized

        let v1 = new Vector3();
        let r;

        const EPS = 0.000001;

        return function setFromUnitVectors(vFrom, vTo) {

            if (v1 === undefined) v1 = new Vector3();

            r = vFrom.dot(vTo) + 1;

            if (r < EPS) {

                r = 0;

                if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

                    v1.set(-vFrom.y, vFrom.x, 0);

                } else {

                    v1.set(0, -vFrom.z, vFrom.y);

                }

            } else {

                v1.crossVectors(vFrom, vTo);

            }

            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;

            return this.normalize();

        };

    }()

    angleTo(q) {

        return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));

    }

    rotateTowards(q, step) {

        const angle = this.angleTo(q);

        if (angle === 0) return this;

        const t = Math.min(1, step / angle);

        this.slerp(q, t);

        return this;

    }

    inverse() {

        // quaternion is assumed to have unit length

        return this.conjugate();

    }

    conjugate() {

        this._x *= -1;
        this._y *= -1;
        this._z *= -1;

        this.onChangeCallback();

        return this;

    }

    dot(v) {

        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

    }

    lengthSq() {

        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

    }

    length() {

        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);

    }

    normalize() {

        let l = this.length();

        if (l === 0) {

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;

        } else {

            l = 1 / l;

            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;

        }

        this.onChangeCallback();

        return this;

    }

    multiply(q, p) {

        if (p !== undefined) {

            console.warn('');
            return this.multiplyQuaternions(q, p);

        }

        return this.multiplyQuaternions(this, q);

    }

    premultiply(q) {

        return this.multiplyQuaternions(q, this);

    }

    multiplyQuaternions(a, b) {

        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
        const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        this.onChangeCallback();
        return this;
    }

    slerp(qb, t) {

        if (t === 0) return this;
        if (t === 1) return this.copy(qb);

        const x = this._x, y = this._y, z = this._z, w = this._w;

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        if (cosHalfTheta < 0) {

            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;

            cosHalfTheta = -cosHalfTheta;

        } else {

            this.copy(qb);

        }

        if (cosHalfTheta >= 1.0) {

            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;

            return this;

        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= /*Number.EPSILON*/0.0000000000001) {

            const s = 1 - t;
            this._w = s * w + t * this._w;
            this._x = s * x + t * this._x;
            this._y = s * y + t * this._y;
            this._z = s * z + t * this._z;

            return this.normalize();

        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        this._w = (w * ratioA + this._w * ratioB);
        this._x = (x * ratioA + this._x * ratioB);
        this._y = (y * ratioA + this._y * ratioB);
        this._z = (z * ratioA + this._z * ratioB);

        this.onChangeCallback();

        return this;

    }

    equals(quaternion) {

        return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);

    }

    fromArray(array, offset = 0) {

        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        this._w = array[offset + 3];

        this.onChangeCallback();

        return this;

    }

    toArray(array = [], offset = 0) {

        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._w;

        return array;

    }

    onChange(callback) {

        this.onChangeCallback = callback;

        return this;

    }

    private onChangeCallback() {
    }

}

export function quat(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    return new Quaternion(x, y, z, w);
}
