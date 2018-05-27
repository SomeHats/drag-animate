// @flow
import { decorate, observable } from 'mobx';
import invariant from 'invariant';
import {
  genId,
  serializable,
  refList,
  serialize,
  deserialize,
  type Serialization,
} from '../serialize';
import Vector2 from '../Vector2';
import Shape from './shapes/Shape';

class Scene {
  id = genId();
  width: number;
  height: number;
  keyPoints: Vector2[] = [];
  shapes: Shape[] = [];

  static deserialize(object: Serialization): Scene {
    const scene = deserialize(object);
    invariant(scene instanceof Scene, 'deserialized object is not Scene');
    return scene;
  }

  init(width: number, height: number): this {
    this.width = width;
    this.height = height;
    this.keyPoints = [new Vector2(width / 2, height / 2)];
    return this;
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  serialize(): Serialization {
    return serialize(this);
  }
}

serializable(Scene, 'Scene', ['width', 'height'], {
  keyPoints: refList(Vector2),
  shapes: refList(Shape),
});

export default decorate(Scene, {
  width: observable,
  height: observable,
  keyPoints: observable,
  shapes: observable,
});

window.Scene = Scene;
