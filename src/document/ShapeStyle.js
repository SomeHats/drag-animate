// @flow
import { decorate, observable } from 'mobx';
import { genId, serializable } from '../lib/serialize';

const defaultStrokeColor = '#000000';
const defaultFillColor = '#abcdef';

class ShapeStyle {
  id = genId();
  hasStroke: boolean = true;
  hasFill: boolean = false;
  strokeWidth: number = 1;
  strokeColor: string = defaultStrokeColor;
  fillColor: string = defaultFillColor;

  drawCurrentContextPath(ctx: CanvasRenderingContext2D) {
    if (this.hasFill) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    if (this.hasStroke) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke();
    }
  }

  drawPath(ctx: CanvasRenderingContext2D, path: Path2D) {
    if (this.hasFill) {
      ctx.fillStyle = this.fillColor;
      ctx.fill(path);
    }
    if (this.hasStroke) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke(path);
    }
  }
}

serializable(ShapeStyle, 'ShapeStyle', [
  'hasFill',
  'hasStroke',
  'strokeWidth',
  'strokeColor',
  'fillColor',
]);

export default decorate(ShapeStyle, {
  strokeWidth: observable,
  strokeColor: observable,
  fillColor: observable,
  hasStroke: observable,
  hasFill: observable,
});
