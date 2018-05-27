// @flow
import { decorate, observable } from 'mobx';

class ShapeStyle {
  strokeWidth: number = 1;
  strokeColor: null | string = 'black';
  fillColor: null | string = null;

  drawCurrentContextPath(ctx: CanvasRenderingContext2D) {
    if (this.fillColor !== null) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    if (this.strokeColor !== null) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke();
    }
  }
}

export default decorate(ShapeStyle, {
  strokeWidth: observable,
  strokeColor: observable,
  fillColor: observable,
});
