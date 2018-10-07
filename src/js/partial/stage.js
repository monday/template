import {Drawing} from './drawing';

/**
 * 座席表を表示する
 */
export class Stage {
    constructor(target) {
        this.target = target;
        this.shapes = [];

        this.draw = new Drawing(this.target);
        this.draw.push = (shape) => {
            this.shapes.push(shape);
        };
    }
}


