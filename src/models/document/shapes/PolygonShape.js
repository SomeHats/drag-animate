// @flow
import { decorate, observable } from 'mobx';
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
}

serializable(PolygonShape, 'PolygonShape', ['isClosed'], {
  points: refList(Vector2),
});

export default decorate(PolygonShape, {
  points: observable,
  isClosed: observable,
});

window.PolygonShape = PolygonShape;
