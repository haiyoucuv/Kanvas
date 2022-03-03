/*
 * Tools.ts
 * Created by 还有醋v on 2021/12/19.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import { v3 } from "../math";

export function hex2rgb(hex: number) {
	return v3(
		((hex >> 16) & 0xFF) / 255,
		((hex >> 8) & 0xFF) / 255,
		(hex & 0xFF) / 255,
	);
}

