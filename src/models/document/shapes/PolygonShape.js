// @flow
import { decorate, observable, computed } from 'mobx';
import { genId, serializable, refList } from '../../serialize';
import Vector2 from '../../Vector2';
import Shape from './Shape';

class PolygonShape extends Shape {
  id = genId();
  points: Vector2[] = [];
  isClosed: boolean = false;

  addPoint(point: Vector2) {
    this.points.push(point);
  }

  close() {
    this.isClosed = true;
  }

  get canvasPath(): Path2D {
    const path = new Path2D();
    this.points.forEach(({ x, y }, i) => {
      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });
    if (this.isClosed) {
      path.closePath();
    }

    return path;
  }
}

serializable(PolygonShape, 'PolygonShape', ['isClosed'], {
  points: refList(Vector2),
});

export default decorate(PolygonShape, {
  points: observable,
  isClosed: observable,
  canvasPath: computed,
});

window.PolygonShape = PolygonShape;
