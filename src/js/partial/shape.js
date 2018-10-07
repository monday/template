/**
 * 矩形オブジェクトを返す
 */
export class Rect {
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

        return shape;
    }
}
