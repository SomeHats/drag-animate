// @flow
import { observable } from 'mobx';
import Vector2 from '../../lib/Vector2';
import { genId, serializable, ref, refList } from '../../lib/serialize';
import { getShapePath } from '../../lib/CanvasHelpers';
import ShapeStyle from '../ShapeStyle';
import MagicPointThingy from '../MagicPointThingy';
import ShapePoint from './ShapePoint';

class Shape {
  id = genId();
  @observable
  style: ShapeStyle = new ShapeStyle();
  @observable
  points: ShapePoint[] = [];
  @observable
  isClosed: boolean = false;

  addPoint(point: ShapePoint) {
    this.points.push(point);
  }

  close() {
    this.isClosed = true;
  }

  getCanvasPathAtBasePoint(basePoint: Vector2): Path2D {
    return getShapePath(this.points, basePoint, this.isClosed);
  }

  drawToCanvasAtBasePoint(ctx: CanvasRenderingContext2D, basePoint: Vector2) {
    this.style.drawPath(ctx, this.getCanvasPathAtBasePoint(basePoint));
  }
}

serializable(Shape, 'Shape', ['isClosed'], {
  style: ref(ShapeStyle),
  points: refList(MagicPointThingy),
});

export default Shape;
