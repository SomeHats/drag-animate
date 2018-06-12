// @flow
import { decorate, observable, computed, action } from 'mobx';
import invariant from 'invariant';
import { genId, serializable, ref, refObjectMap } from '../serialize';
import Vector2 from '../Vector2';
import KeyPointSet from './KeypointSet';
import ThinPlateSplines2 from '../ThinPlateSplines';

class MagicPointThingy {
  id = genId();
  keyPointSet: KeyPointSet;
  pointsByKeyPointId: { [string]: Vector2 } = {};

  init(keyPointSet: KeyPointSet): this {
    this.keyPointSet = keyPointSet;
    return this;
  }

  get definedKeyPoints(): Vector2[] {
    return Object.keys(this.pointsByKeyPointId)
      .filter(keyPointId => this.pointsByKeyPointId[keyPointId] != null)
      .map(keyPointId => {
        const keyPoint = this.keyPointSet.get(keyPointId);
        invariant(keyPoint, 'point must exist');
        return keyPoint;
      });
  }

  get thinPlateSplinesX(): ThinPlateSplines2 {
    const sourcePoints = this.keyPointSet.keyPoints;
    const targetValues = sourcePoints.map(point => this.getAtKeyPoint(point).x);
    return new ThinPlateSplines2(sourcePoints, targetValues);
  }

  get thinPlateSplinesY(): ThinPlateSplines2 {
    const sourcePoints = this.keyPointSet.keyPoints;
    const targetValues = sourcePoints.map(point => this.getAtKeyPoint(point).y);
    return new ThinPlateSplines2(sourcePoints, targetValues);
  }

  getAtKeyPoint(keyPoint: Vector2): Vector2 {
    invariant(this.keyPointSet.has(keyPoint), 'key point must be in scene');
    if (this.pointsByKeyPointId[String(keyPoint.id)] != null) {
      return this.pointsByKeyPointId[String(keyPoint.id)];
    }

    const point = keyPoint.findNearest(this.definedKeyPoints);
    invariant(point, 'nearest point must be found');
    return this.pointsByKeyPointId[String(point.id)];
  }

  setAtKeyPoint(keyPoint: Vector2, value: Vector2) {
    invariant(this.keyPointSet.has(keyPoint), 'keyPoint must exist in scene');
    this.pointsByKeyPointId[String(keyPoint.id)] = value;
  }

  getAtBasePoint(atPoint: Vector2): Vector2 {
    const v = new Vector2(
      this.thinPlateSplinesX.getValue(atPoint),
      this.thinPlateSplinesY.getValue(atPoint)
    );
    console.log({ atPoint, v });
    return v;
  }
}

serializable(MagicPointThingy, 'MagicPointThingy', [], {
  keyPointSet: ref(KeyPointSet),
  pointsByKeyPointId: refObjectMap(Vector2),
});

export default decorate(MagicPointThingy, {
  keyPointSet: observable,
  pointsByKeyPointId: observable,
  setAtKeyPoint: action,
  definedKeyPoints: computed,
  thinPlateSplinesX: computed,
  thinPlateSplinesY: computed,
});
