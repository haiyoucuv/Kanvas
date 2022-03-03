import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Matrix4 } from './Matrix4';

export class Box3 {
    constructor(
        public min: Vector3 = new Vector3(+Infinity, +Infinity, +Infinity),
        public max: Vector3 = new Vector3(-Infinity, -Infinity, -Infinity)
    ) {
    }

    set(min: Vector3, max: Vector3) {
        this.min.copy(min);
        this.max.copy(max);
        return this
    }

    clone() {
        return new Box3().copy(this);
    }

    copy(box: Box3) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    };

    makeEmpty() {
        this.min.x = this.min.y = this.min.z = +Infinity;
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
    }

    isEmpty() {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

    /**
     * 获取中心点
     * @param out
     */
    getCenter(out: Vector3 = new Vector3()): Vector3 {
        return this.isEmpty() ? out.set(0, 0, 0) : out.addVectors(this.min, this.max).multiplyScalar(0.5);
    };

    /**
     * 获取对角线向量
     * @param out
     */
    getSize(out: Vector3 = new Vector3()): Vector3 {
        return this.isEmpty() ? out.set(0, 0, 0) : out.subVectors(this.max, this.min);
    };

    /**
     *
     * @param array 一般是顶点一维数组
     */
    setFromArray(array: number[] | Float32Array) {

        let minX = +Infinity;
        let minY = +Infinity;
        let minZ = +Infinity;

        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        for (let i = 0, l = array.length; i < l; i += 3) {

            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;

            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;

        }

        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);
        return this;
    }

    setFromCenterAndSize(center: Vector3, size: Vector3) {
        const v1 = new Vector3();
        const halfSize = v1.copy(size).multiplyScalar(0.5);
        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);
        return this;
    }

    setFromPoints(points: Vector3[]) {
        this.makeEmpty();
        for (let i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }

    /// TODO
    // setFromObject(object: Object3D) {
    //     this.makeEmpty();
    //     return this.expandByObject(object);
    // };

    /**
     * 为了包含该点坐标
     * @param point
     */
    expandByPoint(point: Vector3) {
        this.min.min(point);
        this.max.max(point);
        return this;
    };

    /**
     * 为了xyz分别根据vector进行扩展
     * @param vector
     */
    expandByVector(vector: Vector3) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    };

    expandByScalar(scalar: number) {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);
        return this;
    };

    /// TODO
    // expandByObject(object: Object3D) {
    //
    //     let scope = this;
    //
    //     const v1 = new Vector3();
    //
    //     object.updateWorldMatrix();
    //
    //     traverse(object);
    //
    //     function traverse(node: Object3D) {
    //         //@ts-ignore 自己的先算
    //         const geometry = node.geometry;
    //         if (geometry !== undefined && geometry._vertices) {
    //             const vertices = geometry._vertices;
    //             for (let i = 0; i < vertices.length; i += 3) {
    //                 v1.set(vertices[i], vertices[i + 1], vertices[i + 2]).applyMatrix4(node.worldMatrix);
    //                 scope.expandByPoint(v1);
    //             }
    //         }
    //         //子级递归
    //         for (let j = 0; j < node.children.length; j++) traverse(node.children[j]);
    //     }
    //
    //     return scope;
    // };

    containsPoint(point: Vector3) {
        return !(point.x < this.min.x || point.x > this.max.x ||
            point.y < this.min.y || point.y > this.max.y ||
            point.z < this.min.z || point.z > this.max.z);
    };

    containsBox(box: Box3) {
        return this.min.x <= box.min.x && box.max.x <= this.max.x &&
            this.min.y <= box.min.y && box.max.y <= this.max.y &&
            this.min.z <= box.min.z && box.max.z <= this.max.z;
    };

    intersectsBox(box: Box3) {
        return !(box.max.x < this.min.x || box.min.x > this.max.x ||
            box.max.y < this.min.y || box.min.y > this.max.y ||
            box.max.z < this.min.z || box.min.z > this.max.z);

    };

    intersectsSphere(sphere: Sphere) {
        const closestPoint = new Vector3();
        // Find the point on the AABB closest to the sphere center.
        this.clampPoint(sphere.center, closestPoint);
        // If that point is inside the sphere, the AABB and sphere intersect.
        return closestPoint.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
    };

    clampPoint(point: Vector3, out: Vector3 = new Vector3()) {
        return out.copy(point).clamp(this.min, this.max);
    };

    distanceToPoint(point: Vector3) {
        const v1 = new Vector3();
        const clampedPoint = v1.copy(point).clamp(this.min, this.max);
        return clampedPoint.sub(point).length();
    }

    getBoundingSphere(out: Sphere = new Sphere()) {
        const v1 = new Vector3();
        this.getCenter(out.center);
        out.radius = this.getSize(v1).length() * 0.5;
        return out;
    }

    intersect(box: Box3) {
        this.min.max(box.min);
        this.max.min(box.max);
        // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
        if (this.isEmpty()) this.makeEmpty();
        return this;

    }

    union(box: Box3) {

        this.min.min(box.min);
        this.max.max(box.max);

        return this;

    }

    applyMatrix4(matrix: Matrix4) {

        const points = [
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3()
        ];
        // transform of empty box is an empty box.
        if (this.isEmpty()) return this;

        // NOTE: I am using a binary pattern to specify all 2^3 combinations below
        points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
        points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
        points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
        points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
        points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
        points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
        points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
        points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

        this.setFromPoints(points);
        return this;
    }

    translate(offset: Vector3) {

        this.min.add(offset);
        this.max.add(offset);
        return this;
    }

    equals(box: Box3) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
}



