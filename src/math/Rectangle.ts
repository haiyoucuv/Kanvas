import { Vector2 } from "./Vector2";

export class Rectangle {

	/**
	 * 构造函数
	 * @method Rectangle
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
	}

	clear() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
	}

	copy(rect: Rectangle) {
		this.x = rect.x;
		this.y = rect.y;
		this.width = rect.width;
		this.height = rect.height;

		return this;
	}

	clone() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	/**
	 * 矩形左上角的 x 坐标
	 * @property x
	 * @public
	 * @since 1.0.0
	 * @type{number}
	 * @default 0
	 */
	public x: number = 0;
	/**
	 * 矩形左上角的 y 坐标
	 * @property y
	 * @public
	 * @since 1.0.0
	 * @type{number}
	 * @default 0
	 */
	public y: number = 0;
	/**
	 * 矩形的宽度（以像素为单位）
	 * @property width
	 * @public
	 * @since 1.0.0
	 * @type{number}
	 * @default 0
	 */
	public width: number = 0;
	/**
	 * 矩形的高度（以像素为单位）
	 * @property height
	 * @public
	 * @since 1.0.0
	 * @type{number}
	 * @default 0
	 */
	public height: number = 0;

	/**
	 * 左边界
	 */
	get left(): number {
		return this.x;
	}

	/**
	 * 右边界
	 */
	get right(): number {
		return this.x + this.width;
	}

	/**
	 * 上边界
	 */
	get top(): number {
		return this.y;
	}

	/**
	 * 下边界
	 */
	get bottom(): number {
		return this.y + this.height;
	}

	/**
	 * 判断一个点是否在矩形内包括边
	 */
	public isPointIn(point: Vector2): boolean {
		const { x, y, width, height } = this;
		return point.x >= x && point.x <= (x + width) && point.y >= y && point.y <= (y + height);
	}

	/**
	 * Fits this rectangle around the passed one.
	 *
	 * @param {Rectangle} rectangle - The rectangle to fit.
	 */
	fit(rectangle: Rectangle) {
		var x1 = Math.max(this.x, rectangle.x);
		var x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
		var y1 = Math.max(this.y, rectangle.y);
		var y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);

		this.x = x1;
		this.width = Math.max(x2 - x1, 0);
		this.y = y1;
		this.height = Math.max(y2 - y1, 0);
	};

	/**
	 * Pads the rectangle making it grow in all directions.
	 *
	 * @param {number} paddingX - The horizontal padding amount.
	 * @param {number} [paddingY] - The vertical padding amount.
	 */
	pad(paddingX: number, paddingY?: number) {
		paddingX = paddingX || 0;
		paddingY = paddingY || ((paddingY !== 0) ? paddingX : 0);

		this.x -= paddingX;
		this.y -= paddingY;

		this.width += paddingX * 2;
		this.height += paddingY * 2;
	}

	/**
	 * 将多个矩形合成为一个矩形,并将结果存到第一个矩形参数，并返回
	 */
	public static createFromRects(...arg: Rectangle[]): Rectangle {
		if (arg.length == 0) {
			return null;
		} else if (arg.length == 1) {
			return arg[0];
		} else {
			let rect = arg[0];
			let x = rect.x, y = rect.y, w = rect.width, h = rect.height, wx1: number, wx2: number, hy1: number,
				hy2: number;
			for (let i: number = 1; i < arg.length; i++) {
				//如果宽高为空，后续考虑是否xy需要占位;
				if (!arg[i].width && !arg[i].height) continue;
				wx1 = x + w;
				hy1 = y + h;
				wx2 = arg[i].x + arg[i].width;
				hy2 = arg[i].y + arg[i].height;
				if (x > arg[i].x /*|| wx1 == 0*/ || (x == 0 && w == 0)) {//先去掉wx1和hy1==0判断,如果x为负的，w为正的，也可能0
					x = arg[i].x;
				}
				if (y > arg[i].y /*|| hy1 == 0*/ || (y == 0 && h == 0)) {//待检查 TODO
					y = arg[i].y;
				}
				if (wx1 < wx2) {
					wx1 = wx2;
				}
				if (hy1 < hy2) {
					hy1 = hy2;
				}
				rect.x = x;
				rect.y = y;
				rect.width = wx1 - x;
				rect.height = hy1 - y;
			}
			return rect;
		}
	}

	/**
	 * 通过一系列点来生成一个矩形
	 * 返回包含所有给定的点的最小矩形
	 */
	public static createFromPoints(rect: Rectangle, ...arg: Vector2[]): Rectangle {
		let x = arg[0].x, y = arg[0].y, w = arg[0].x, h = arg[0].y;
		for (let i: number = 1; i < arg.length; i++) {
			if (arg[i] == null) continue;
			if (x > arg[i].x) {
				x = arg[i].x;
			}
			if (y > arg[i].y) {
				y = arg[i].y;
			}
			if (w < arg[i].x) {
				w = arg[i].x;
			}
			if (h < arg[i].y) {
				h = arg[i].y;
			}
		}
		rect.x = x;
		rect.y = y;
		rect.width = w - x;
		rect.height = h - y;
		return rect;
	}


	/**
	 * 通过两个点来确定一个矩形
	 * @method createRectform2Point
	 */
	public static createRectfrom2Point(rect: Rectangle, p1: Vector2, p2: Vector2): Rectangle {
		let x = p1.x, y = p1.y, w = p1.x, h = p1.y;
		if (x > p2.x) {
			x = p2.x;
		}
		if (y > p2.y) {
			y = p2.y;
		}
		if (w < p2.x) {
			w = p2.x;
		}
		if (h < p2.y) {
			h = p2.y;
		}
		rect.x = x;
		rect.y = y;
		rect.width = w - x;
		rect.height = h - y;
		return rect;
	}

	/**
	 * 判读两个矩形是否相交
	 */
	public crossRect(rb: Rectangle): boolean {
		return Rectangle.testRectCross(this, rb);
	}

	/**
	 * 判读两个矩形是否相交
	 */
	public static testRectCross(ra: Rectangle, rb: Rectangle): boolean {
		let a_cx: number, a_cy: number; /* 第一个中心点*/
		let b_cx: number, b_cy: number; /* 第二个中心点*/
		a_cx = ra.x + (ra.width / 2);
		a_cy = ra.y + (ra.height / 2);
		b_cx = rb.x + (rb.width / 2);
		b_cy = rb.y + (rb.height / 2);
		return ((Math.abs(a_cx - b_cx) <= (ra.width / 2 + rb.width / 2)) && (Math.abs(a_cy - b_cy) <= (ra.height / 2 + rb.height / 2)));
	}

}
