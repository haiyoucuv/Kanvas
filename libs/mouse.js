class Effect {
	
	canvas;
	centerX = window.innerWidth * 0.5;
	centerY = window.innerHeight * 0.5;
	
	orbit = 70;
	count = 25;
	minScale = 1;
	maxScale = 2;
	scaleSpeed = 1;
	
	isTouch = false;
	
	particleData = [];
	
	constructor() {
		const canvas = this.canvas = document.createElement("canvas");
		canvas.style.position = "fixed";
		canvas.style.left = "0";
		canvas.style.top = "0";
		canvas.style.zIndex = "2147483647";
		canvas.style.pointerEvents = "none";
		document.body.append(canvas);
		
		this.ctx = canvas.getContext("2d");
		
		this.init();
	}
	
	onMouseMove = (e) => {
		this.centerX = e.clientX;
		this.centerY = e.clientY;
	}
	
	onResize = () => {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
	
	onMouseDown = () => {
		this.isTouch = true;
	}
	
	onMouseUp = () => {
		this.isTouch = false;
	}
	
	init() {
		
		window.addEventListener("mousemove", this.onMouseMove, false);
		window.addEventListener("mousedown", this.onMouseDown, false);
		window.addEventListener("mouseup", this.onMouseUp, false);
		window.addEventListener("resize", this.onResize, false);
		
		// 初始化数据
		for (let t = 0; t < this.count; t++) {
			this.particleData.push({
				size: 1,
				position: { x: this.centerX, y: this.centerY },
				offset: { x: 0, y: 0 },
				shift: { x: this.centerX, y: this.centerY },
				speed: .01 + .04 * Math.random(),
				targetSize: 1,
				fillColor: "#" + (9453632 * Math.random() + 11184810 | 0).toString(16),
				orbit: .5 * this.orbit + .5 * this.orbit * Math.random()
			});
		}
		this.onResize();
		this.loop();
	}
	
	loop = () => {
		const { ctx, particleData } = this;
		
		this.isTouch ? this.minScale += .02 * (this.maxScale - this.minScale) : this.minScale -= .02 * (this.minScale - this.scaleSpeed);
		this.minScale = Math.min(this.minScale, this.maxScale);
		
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		const len = particleData.length;
		for (let i = 0; i < len; i++) {
			const particle = particleData[i];
			const pos = { x: particle.position.x, y: particle.position.y };
			
			particle.offset.x += particle.speed;
			particle.offset.y += particle.speed;
			
			particle.shift.x += (this.centerX - particle.shift.x) * particle.speed;
			particle.shift.y += (this.centerY - particle.shift.y) * particle.speed;
			
			particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit * this.minScale);
			particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit * this.minScale);
			particle.position.x = Math.max(Math.min(particle.position.x, window.innerWidth), 0);
			particle.position.y = Math.max(Math.min(particle.position.y, window.innerHeight), 0);
			
			particle.size += .01 * (particle.targetSize - particle.size);
			
			Math.round(particle.size) === Math.round(particle.targetSize) && (particle.targetSize = 1 + 2 * Math.random());
			
			ctx.beginPath();
			ctx.fillStyle = particle.fillColor;
			ctx.strokeStyle = particle.fillColor;
			ctx.lineWidth = particle.size;
			ctx.moveTo(pos.x, pos.y);
			ctx.lineTo(particle.position.x, particle.position.y);
			ctx.stroke();
			ctx.arc(particle.position.x, particle.position.y, particle.size / 2, 0, 2 * Math.PI, true);
			ctx.fill();
		}
		window.requestAnimationFrame(this.loop);
	}
	
}

new Effect();
