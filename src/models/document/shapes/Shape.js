// @flow
import invariant from 'invariant';
import { observable, decorate } from 'mobx';
import ShapeStyle from '../ShapeStyle';
import { genId, serializable, ref } from '../../serialize';

class Shape {
  id = genId();
  style: ShapeStyle = new ShapeStyle();

  get canvasPath(): Path2D {
    invariant(false, 'not implemented');
  }

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    this.style.drawPath(ctx, this.canvasPath);
  }
}

serializable(Shape, 'Shape', [], { style: ref(ShapeStyle) });

export default decorate(Shape, {
  style: observable,
});
