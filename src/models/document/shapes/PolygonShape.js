// @flow
import { decorate, observable } from 'mobx';
import Vector2 from '../../Vector2';
import Shape from './Shape';

class PolygonShape extends Shape {
  points: Vector2[] = [];
  isClosed: boolean = false;

  addPoint(point: Vector2) {
    this.points.push(point);
  }

  close() {
    this.isClosed = true;
  }
}

export default decorate(PolygonShape, {
  points: observable,
  isClosed: observable,
});
