// @flow
import { observable } from 'mobx';
import { genId, serializable } from '../lib/serialize';

const defaultStrokeColor = '#000000';
const defaultFillColor = '#abcdef';

class ShapeStyle {
  id = genId();
  @observable
  hasStroke: boolean = true;
  @observable
  hasFill: boolean = false;
  @observable
  strokeWidth: number = 1;
  @observable
  strokeColor: string = defaultStrokeColor;
  @observable
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

export default ShapeStyle;
