// @flow
import { decorate, observable } from 'mobx';
import invariant from 'invariant';
import {
  genId,
  serializable,
  ref,
  refList,
  serialize,
  deserialize,
  type Serialization,
} from '../serialize';
import Vector2 from '../Vector2';
import Shape from './shapes/Shape';
import KeyPointSet from './KeypointSet';
import MagicPointThingy from './MagicPointThingy';

class Scene {
  id = genId();
  width: number;
  height: number;
  keyPointSet: KeyPointSet;
  shapes: Shape[] = [];

  static deserialize(object: Serialization): Scene {
    const scene = deserialize(object);
    invariant(scene instanceof Scene, 'deserialized object is not Scene');
    return scene;
  }

  init(width: number, height: number): this {
    this.width = width;
    this.height = height;
    this.keyPointSet = new KeyPointSet();
    this.keyPointSet.addKeyPoint(new Vector2(width / 2, height / 2));
    return this;
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  serialize(): Serialization {
    return serialize(this);
  }

  createMagicPointThingy(): MagicPointThingy {
    return new MagicPointThingy().init(this.keyPointSet);
  }
}

serializable(Scene, 'Scene', ['width', 'height'], {
  keyPointSet: ref(KeyPointSet),
  shapes: refList(Shape),
});

export default decorate(Scene, {
  width: observable,
  height: observable,
  shapes: observable,
});

window.Scene = Scene;
