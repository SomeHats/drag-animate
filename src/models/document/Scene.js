// @flow
import { decorate, observable } from 'mobx';
import Vector2 from '../Vector2';
import type PolygonShape from './shapes/PolygonShape';

class Scene {
  width: number;
  height: number;
  keyPoints: Vector2[] = [];
  shapes: PolygonShape[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.keyPoints = [new Vector2(width / 2, height / 2)];
  }

  addShape(shape: PolygonShape) {
    this.shapes.push(shape);
  }
}

export default decorate(Scene, {
  width: observable,
  height: observable,
  keyPoints: observable,
  shapes: observable,
});
