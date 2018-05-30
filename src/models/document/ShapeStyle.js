// @flow
import { decorate, observable } from 'mobx';
import { genId, serializable } from '../serialize';

class ShapeStyle {
  id = genId();
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

  drawPath(ctx: CanvasRenderingContext2D, path: Path2D) {
    if (this.fillColor !== null) {
      ctx.fillStyle = this.fillColor;
      ctx.fill(path);
    }
    if (this.strokeColor !== null) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke(path);
    }
  }
}

serializable(ShapeStyle, 'ShapeStyle', [
  'strokeWidth',
  'strokeColor',
  'fillColor',
]);

export default decorate(ShapeStyle, {
  strokeWidth: observable,
  strokeColor: observable,
  fillColor: observable,
});
