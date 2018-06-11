// @flow
import invariant from 'invariant';
import { observable, decorate } from 'mobx';
import ShapeStyle from '../ShapeStyle';
import type Vector2 from '../../Vector2';
import MagicPointThingy from '../MagicPointThingy';
import { genId, serializable, ref, refList } from '../../serialize';

class Shape {
  id = genId();
  style: ShapeStyle = new ShapeStyle();
  points: MagicPointThingy[] = [];
  isClosed: boolean = false;

  addPoint(point: MagicPointThingy) {
    this.points.push(point);
  }

  close() {
    this.isClosed = true;
  }

  getCanvasPathAtBasePoint(basePoint: Vector2): Path2D {
    const path = new Path2D();
    this.points.forEach((point, i) => {
      const { x, y } = point.getAtBasePoint(basePoint);
      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });
    if (this.isClosed) path.closePath();
    return path;
  }

  drawToCanvasAtBasePoint(ctx: CanvasRenderingContext2D, basePoint: Vector2) {
    this.style.drawPath(ctx, this.getCanvasPathAtBasePoint(basePoint));
  }
}

serializable(Shape, 'Shape', ['isClosed'], {
  style: ref(ShapeStyle),
  points: refList(MagicPointThingy),
});

export default decorate(Shape, {
  style: observable,
  points: observable,
  isClosed: observable,
});
