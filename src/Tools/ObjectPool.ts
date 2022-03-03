/*
 * ObjectPool.ts
 * Created by 还有醋v on 2021/12/21.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

export class ObjectPool {

	private static objs: { [key in string]: Array<any> } = {};

	static get(key: string) {
		const arr = ObjectPool.objs[key];
		if (!arr || arr.length <= 0) return null;
		return arr.splice(arr.length * Math.random() >> 0, 1)[0];
	}

	static put(key: string, obj: any) {
		const objs = ObjectPool.objs;
		if (!objs[key]) objs[key] = [];
		objs[key].push(obj);
	}

}
