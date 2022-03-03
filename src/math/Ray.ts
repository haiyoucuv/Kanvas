import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Box3 } from './Box3';
import { Matrix4 } from './Matrix4';

export class Ray {
    constructor(
        public origin: Vector3 = new Vector3(),
        public direction: Vector3 = new Vector3()
    ) {
    }

    set(origin: Vector3, direction: Vector3) {
        this.origin.copy(origin);
        this.direction.copy(direction);
        return this;
    }

    clone() {
        return new Ray().copy(this);
    }

    copy(ray: Ray) {
        this.origin.copy(ray.origin);
        this.direction.copy(ray.direction);
        return this;
    }

    at(t: number, target: Vector3) {
        return target.copy(this.direction).multiplyScalar(t).add(this.origin);
    }

    lookAt(v: Vector3) {
        this.direction.copy(v).sub(this.origin).normalize();
        return this;
    }

    recast(t: number) {
        const v1 = new Vector3();
        this.origin.copy(this.at(t, v1));
        return this;
    }

    closestPointToPoint(point: Vector3, out: Vector3 = new Vector3()) {

        out.subVectors(point, this.origin);

        const directionDistance = out.dot(this.direction);

        if (directionDistance < 0) return out.copy(this.origin);

        return out.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
    }

    distanceToPoint(point: Vector3) {
        return Math.sqrt(this.distanceSqToPoint(point));
    }

    distanceSqToPoint(point: Vector3) {

        const v1 = new Vector3();

        const directionDistance = v1.subVectors(point, this.origin).dot(this.direction);

        // point behind the ray

        if (directionDistance < 0) {

            return this.origin.distanceToSquared(point);

        }

        v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);

        return v1.distanceToSquared(point);

    };

    intersectSphere(sphere: Sphere, out: Vector3) {

        const v1 = new Vector3();
        v1.subVectors(sphere.center, this.origin);
        const tca = v1.dot(this.direction);
        const d2 = v1.dot(v1) - tca * tca;
        const radius2 = sphere.radius * sphere.radius;

        if (d2 > radius2) return null;

        const thc = Math.sqrt(radius2 - d2);

        // t0 = first intersect point - entrance on front of sphere
        const t0 = tca - thc;

        // t1 = second intersect point - exit point on back of sphere
        const t1 = tca + thc;

        // test to see if both t0 and t1 are behind the ray - if so, return null
        if (t0 < 0 && t1 < 0) return null;

        // test to see if t0 is behind the ray:
        // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
        // in order to always return an intersect point that is in front of the ray.
        if (t0 < 0) return this.at(t1, out);

        // else t0 is in front of the ray, so return the first collision point scaled by t0
        return this.at(t0, out);
    };

    intersectsSphere(sphere: Sphere) {
        return this.distanceSqToPoint(sphere.center) <= (sphere.radius * sphere.radius);
    }

    intersectBox(box: Box3, out: Vector3) {

        let tmin, tmax, tymin, tymax, tzmin, tzmax;

        const invdirx = 1 / this.direction.x,
            invdiry = 1 / this.direction.y,
            invdirz = 1 / this.direction.z;

        const origin = this.origin;

        if (invdirx >= 0) {

            tmin = (box.min.x - origin.x) * invdirx;
            tmax = (box.max.x - origin.x) * invdirx;

        } else {

            tmin = (box.max.x - origin.x) * invdirx;
            tmax = (box.min.x - origin.x) * invdirx;

        }

        if (invdiry >= 0) {

            tymin = (box.min.y - origin.y) * invdiry;
            tymax = (box.max.y - origin.y) * invdiry;

        } else {

            tymin = (box.max.y - origin.y) * invdiry;
            tymax = (box.min.y - origin.y) * invdiry;

        }

        if ((tmin > tymax) || (tymin > tmax)) return null;

        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN

        if (tymin > tmin || tmin !== tmin) tmin = tymin;

        if (tymax < tmax || tmax !== tmax) tmax = tymax;

        if (invdirz >= 0) {

            tzmin = (box.min.z - origin.z) * invdirz;
            tzmax = (box.max.z - origin.z) * invdirz;

        } else {

            tzmin = (box.max.z - origin.z) * invdirz;
            tzmax = (box.min.z - origin.z) * invdirz;

        }

        if ((tmin > tzmax) || (tzmin > tmax)) return null;

        if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

        if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

        //return point closest to the ray (positive side)

        if (tmax < 0) return null;

        return this.at(tmin >= 0 ? tmin : tmax, out);

    }

    intersectsBox(box: Box3) {
        return this.intersectBox(box, new Vector3()) !== null;
    };

    intersectTriangle(
        a: Vector3,
        b: Vector3,
        c: Vector3,
        backfaceCulling: boolean,
        out: Vector3
    ) {

        // Compute the offset origin, edges, and normal.
        const diff = new Vector3();
        const edge1 = new Vector3();
        const edge2 = new Vector3();
        const normal = new Vector3();


        // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

        edge1.subVectors(b, a);
        edge2.subVectors(c, a);
        normal.crossVectors(edge1, edge2);

        // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
        // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
        //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
        //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
        //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
        let DdN = this.direction.dot(normal);
        let sign;

        if (DdN > 0) {

            if (backfaceCulling) return null;
            sign = 1;

        } else if (DdN < 0) {

            sign = -1;
            DdN = -DdN;

        } else {

            return null;

        }

        diff.subVectors(this.origin, a);
        const DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));

        // b1 < 0, no intersection
        if (DdQxE2 < 0) {

            return null;

        }

        const DdE1xQ = sign * this.direction.dot(edge1.cross(diff));

        // b2 < 0, no intersection
        if (DdE1xQ < 0) {

            return null;

        }

        // b1+b2 > 1, no intersection
        if (DdQxE2 + DdE1xQ > DdN) {

            return null;

        }

        // Line intersects triangle, check if ray does.
        const QdN = -sign * diff.dot(normal);

        // t < 0, no intersection
        if (QdN < 0) {

            return null;

        }

        // Ray intersects triangle.
        return this.at(QdN / DdN, out);

    };


    applyMatrix4(matrix4: Matrix4) {
        this.origin.applyMatrix4(matrix4);
        this.direction.transformDirection(matrix4);
        return this;
    };

    equals(ray: Ray) {
        return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
    }
}

export function ray(
    origin: Vector3 = new Vector3(),
    direction: Vector3 = new Vector3()
) {
    return new Ray(origin, direction);
}
