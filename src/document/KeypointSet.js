// @flow
import minBy from 'lodash/minBy';
import { decorate, observable, computed, action } from 'mobx';
import { genId, serializable, refObjectMap, type ID } from '../lib/serialize';
import Vector2 from '../lib/Vector2';

class KeyPointSet {
  id = genId();
  keyPointsById: { [string]: Vector2 } = {};

  get keyPoints(): Vector2[] {
    return Object.keys(this.keyPointsById).map(id => this.keyPointsById[id]);
  }

  addKeyPoint(point: Vector2) {
    this.keyPointsById[String(point.id)] = point;
  }

  get(id: ID | string): Vector2 | null {
    return this.keyPointsById[String(id)] || null;
  }

  has(point: Vector2) {
    return this.get(point.id) === point;
  }

  getNearestTo(targetPoint: Vector2): Vector2 {
    return minBy(this.keyPoints, keyPoint => keyPoint.distanceTo(targetPoint));
  }
}

serializable(KeyPointSet, 'KeyPointSet', [], {
  keyPointsById: refObjectMap(Vector2),
});

export default decorate(KeyPointSet, {
  keyPointsById: observable,
  keyPoints: computed,
  addKeyPoint: action,
});
