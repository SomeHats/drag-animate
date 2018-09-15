// @flow
import minBy from 'lodash/minBy';
import { observable, computed, action } from 'mobx';
import { crash } from '../util';
import { genId, serializable, refObjectMap } from '../lib/serialize';
import Vector2 from '../lib/Vector2';

class KeyPointSet {
  id = genId();
  @observable
  keyPointsById: { [id: string]: Vector2 } = {};

  @computed
  get keyPoints(): Vector2[] {
    return Object.keys(this.keyPointsById).map(id => this.keyPointsById[id]);
  }

  @action
  addKeyPoint(point: Vector2) {
    this.keyPointsById[String(point.id)] = point;
  }

  get(id: string): Vector2 | null {
    return this.keyPointsById[String(id)] || null;
  }

  has(point: Vector2) {
    return this.get(point.id) === point;
  }

  getNearestTo(targetPoint: Vector2): Vector2 {
    const nearest = minBy(this.keyPoints, keyPoint =>
      keyPoint.distanceTo(targetPoint),
    );
    if (!nearest) return crash('nearest must be found');
    return nearest;
  }
}

serializable(KeyPointSet, 'KeyPointSet', [], {
  keyPointsById: refObjectMap(Vector2),
});

export default KeyPointSet;
