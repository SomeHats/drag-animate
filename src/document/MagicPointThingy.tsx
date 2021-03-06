// @flow
import { observable, computed, action } from 'mobx';
import { crash } from '../util';
import { genId, serializable, ref, refObjectMap } from '../lib/serialize';
import Vector2 from '../lib/Vector2';
import KeyPointSet from './KeypointSet';
import ThinPlateSplines2 from '../lib/ThinPlateSplines';

class MagicPointThingy {
  id = genId();
  @observable
  keyPointSet: KeyPointSet = new KeyPointSet();
  @observable
  pointsByKeyPointId: { [keyPointId: string]: Vector2 } = {};

  init(keyPointSet: KeyPointSet): this {
    this.keyPointSet = keyPointSet;
    return this;
  }

  @computed
  get definedKeyPoints(): Vector2[] {
    return Object.keys(this.pointsByKeyPointId)
      .filter(keyPointId => this.pointsByKeyPointId[keyPointId] != null)
      .map(keyPointId => {
        const keyPoint = this.keyPointSet.get(keyPointId);
        if (!keyPoint) return crash('point must exist');
        return keyPoint;
      });
  }

  @computed
  get thinPlateSplinesX(): ThinPlateSplines2 {
    const sourcePoints = this.keyPointSet.keyPoints;
    const targetValues = sourcePoints.map(point => this.getAtKeyPoint(point).x);
    return new ThinPlateSplines2(sourcePoints, targetValues);
  }

  @computed
  get thinPlateSplinesY(): ThinPlateSplines2 {
    const sourcePoints = this.keyPointSet.keyPoints;
    const targetValues = sourcePoints.map(point => this.getAtKeyPoint(point).y);
    return new ThinPlateSplines2(sourcePoints, targetValues);
  }

  getAtKeyPoint(keyPoint: Vector2): Vector2 {
    if (!this.keyPointSet.has(keyPoint)) crash('key point must be in scene');
    if (this.pointsByKeyPointId[String(keyPoint.id)] != null) {
      return this.pointsByKeyPointId[String(keyPoint.id)];
    }

    const point = keyPoint.findNearest(this.definedKeyPoints);
    if (!point) return crash('nearest point must be found');
    return this.pointsByKeyPointId[String(point.id)];
  }

  @action
  setAtKeyPoint(keyPoint: Vector2, value: Vector2) {
    if (!this.keyPointSet.has(keyPoint)) crash('keyPoint must exist in scene');
    this.pointsByKeyPointId[String(keyPoint.id)] = value;
  }

  getAtBasePoint(atPoint: Vector2): Vector2 {
    const v = new Vector2(
      this.thinPlateSplinesX.getValue(atPoint),
      this.thinPlateSplinesY.getValue(atPoint),
    );
    return v;
  }

  transform(
    mapFn: (value: Vector2, keyPoint: Vector2) => Vector2,
  ): MagicPointThingy {
    const transformed = new MagicPointThingy().init(this.keyPointSet);
    this.definedKeyPoints.forEach(keyPoint => {
      transformed.setAtKeyPoint(
        keyPoint,
        mapFn(this.getAtKeyPoint(keyPoint), keyPoint),
      );
    });
    return transformed;
  }

  add(other: MagicPointThingy): MagicPointThingy {
    return this.transform((point, keyPoint) =>
      point.add(other.getAtKeyPoint(keyPoint)),
    );
  }

  subtract(other: MagicPointThingy): MagicPointThingy {
    return this.transform((point, keyPoint) =>
      point.subtract(other.getAtKeyPoint(keyPoint)),
    );
  }

  scale(amt: number): MagicPointThingy {
    return this.transform(point => point.scale(amt));
  }
}

serializable(MagicPointThingy, 'MagicPointThingy', [], {
  keyPointSet: ref(KeyPointSet),
  pointsByKeyPointId: refObjectMap(Vector2),
});

export default MagicPointThingy;
