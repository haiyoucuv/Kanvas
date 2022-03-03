/*
 * Clock.ts
 * Created by 还有醋v on 2021/12/21.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

export class Clock {

	private autoStart: boolean;

	private startTime: number = 0;
	private oldTime: number = 0;
	private elapsedTime: number = 0;

	private running: boolean = false;

	constructor(autoStart: boolean = true) {
		this.autoStart = autoStart;
	}

	start() {
		this.startTime = (typeof performance === 'undefined' ? Date : performance).now();
		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;
	}

	stop() {
		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;
	}

	getElapsedTime() {
		this.getDelta();
		return this.elapsedTime;
	}

	getDelta() {
		let diff = 0;

		if (this.autoStart && !this.running) {
			this.start();
			return 0;
		}

		if (this.running) {
			const newTime = (typeof performance === 'undefined' ? Date : performance).now();
			diff = (newTime - this.oldTime) / 1000;
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}

		return diff;
	}
}
