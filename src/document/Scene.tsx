// @flow
import { observable } from 'mobx';
import { crash } from '../util';
import {
  genId,
  serializable,
  ref,
  refList,
  serialize,
  deserialize,
  Serialization,
} from '../lib/serialize';
import Vector2 from '../lib/Vector2';
import Shape from './shapes/Shape';
import KeyPointSet from './KeypointSet';
import MagicPointThingy from './MagicPointThingy';

class Scene {
  id = genId();
  @observable
  width: number = 0;
  @observable
  height: number = 0;
  @observable
  keyPointSet: KeyPointSet = new KeyPointSet();
  @observable
  shapes: Shape[] = [];

  static deserialize(object: Serialization): Scene {
    const scene = deserialize(object);
    if (!(scene instanceof Scene)) {
      return crash('deserialized object is not Scene');
    }
    return scene;
  }

  init(width: number, height: number): this {
    this.width = width;
    this.height = height;
    this.keyPointSet = new KeyPointSet();
    this.keyPointSet.addKeyPoint(new Vector2(width * 0.25, height * 0.25));
    this.keyPointSet.addKeyPoint(new Vector2(width * 0.75, height * 0.25));
    this.keyPointSet.addKeyPoint(new Vector2(width * 0.75, height * 0.75));
    this.keyPointSet.addKeyPoint(new Vector2(width * 0.25, height * 0.75));
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

export default Scene;
