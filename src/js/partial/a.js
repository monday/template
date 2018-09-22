/**
 * 座席表を表示する
 */
export class Stage {
	constructor(target) {
		this.target = target;
		this.shape = 'rect';
		this.object = null;
		this.objects = [];
		this.startX = 0;
		this.startY = 0;
		this.endX = 0;
		this.endY = 0;

		this.draw();
	}

	/**
	 * オブジェクトを描画する
	 */
	draw() {
		const handleMousedown = (e) => {
			this.startX = e.offsetX;
			this.startY = e.offsetY;
			this.target.addEventListener('mousemove', handleMousemove);
		};

		const handleMousemove = (e) => {
			this.endX = e.offsetX;
			this.endY = e.offsetY;
			if(!this.object){
				this.object = this.createObject();
				this.target.appendChild(this.object);
			}
			const width = this.endX - this.startX;
			const height = this.endY - this.startY;
			const origin = this.calcOrigin(width, height);
			this.object.setAttribute('width', Math.abs(width));
			this.object.setAttribute('height', Math.abs(height));
			this.object.setAttribute('x', origin.x);
			this.object.setAttribute('y', origin.y);
		};

		const handleMouseup = (e) => {
			this.target.removeEventListener('mousemove', handleMousemove);
			this.endX = e.offsetX;
			this.endY = e.offsetY;
			this.objects.push(this.object);
			this.object = null;
		};

		this.target.addEventListener('mousedown', handleMousedown);
		this.target.addEventListener('mouseup', handleMouseup);
	}

	/**
	 * オブジェクトを追加する起点を返す
	 */
	calcOrigin(width, height) {
		let origin = {
			x: 0,
			y: 0,
		}

		// 右下
		if(width > 0 && height > 0){
			origin.x = this.startX;
			origin.y = this.startY;
		// 右上
		}else if(width > 0 && height < 0){
			origin.x = this.startX;
			origin.y = this.endY;
		// 左下
		}else if(width < 0 && height > 0){
			origin.x = this.endX;
			origin.y = this.startY;
		// 左上
		}else if(width < 0 && height < 0){
			origin.x = this.endX;
			origin.y = this.endY;
		}

		return origin;
	}

	/**
	 * オブジェクトを返す
	 */
	createObject() {
		const width = this.endX - this.startX;
		const height = this.endY - this.startY;
		const param = {
			width: width,
			height: height,
			origin: this.calcOrigin(width, height),
		}
		// TODO: 形状にあったclassを呼ぶ様にする
		const shape = new Rect(param);

		return shape;
	}
}


/**
 * 矩形オブジェクトを返す
 */
class Rect {
	constructor(param) {
		this.width = param.width;
		this.height = param.height;
		this.x = param.origin.x;
		this.y = param.origin.y;

		return this.create();
	}

	create() {
		const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		shape.setAttribute('x', this.x);
		shape.setAttribute('y', this.y);
		shape.setAttribute('width', Math.abs(this.width));
		shape.setAttribute('height', Math.abs(this.height));
		shape.setAttribute('fill', '#fff');
		shape.setAttribute('stroke', '#777');
		shape.setAttribute('draggable', true);
		shape.addEventListener('mousedown', (e) => {
			e.stopPropagation();
		});
		shape.addEventListener('dragstart', (e) => {
			console.log('test');
		});

		return shape;
	}
}
