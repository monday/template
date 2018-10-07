import {Rect} from './shape';

/**
 * オブジェクトを描画する
 */
export class Drawing {
    constructor(stage) {
        this.stage = stage;
        this.shape = null;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.mousedown = this.mousedown.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mouseup = this.mouseup.bind(this);

        this.stage.addEventListener('mousedown', this.mousedown);
    }

    mousedown(e) {
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.stage.addEventListener('mousemove', this.mousemove);
        this.stage.addEventListener('mouseup', this.mouseup);
    }

    mousemove(e) {
        this.endX = e.offsetX;
        this.endY = e.offsetY;
        if(!this.shape){
            this.shape = this.createObject();
            this.stage.appendChild(this.shape);
        }
        const width = this.endX - this.startX;
        const height = this.endY - this.startY;
        const origin = this.calcOrigin(width, height);
        this.shape.setAttribute('width', Math.abs(width));
        this.shape.setAttribute('height', Math.abs(height));
        this.shape.setAttribute('x', origin.x);
        this.shape.setAttribute('y', origin.y);
    }

    mouseup() {
        this.push(this.shape);
        this.shape = null;
        this.stage.removeEventListener('mousemove', this.mousemove);
        this.stage.removeEventListener('mouseup', this.mouseup);
    }

    /**
     * オブジェクトを追加する起点を返す
     */
    calcOrigin(width, height) {
        let origin = {
            x: 0,
            y: 0,
        };

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
        };
        // TODO: 形状にあったclassを呼ぶ様にする
        const shape = new Rect(param);

        return shape;
    }

    /**
     * shapeを保存する
     * @interface
     * prop object shape 作成したshape
     */
    push(shape) {
    }

}
