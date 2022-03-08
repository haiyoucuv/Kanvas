/*
 * BasicMaterial.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import Shader from "../Shader/Shader";

export class BasicMaterial extends Material {

	// 在渲染器里，第一次编译的时候附值
	static shader: Shader;

}
