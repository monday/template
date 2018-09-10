import {a} from './partial/a.js';
import {b} from './partial/b.js';
import {c} from './partial/c.js';

a();
b();
c();

class Polygon {
	constructor(height, width) {
		this.height = height;
		this.width = width;
	}

	getArea(){
		return this.height * this.width;
	}
}

const polygon = new Polygon(10, 10);
console.log(polygon.getArea());
