import { observable, computed } from 'mobx';
import { genId, serializable, ref } from '../../lib/serialize';
import MagicPointThingy from '../MagicPointThingy';

class ShapePoint {
  id = genId();
  @observable
  originPoint: MagicPointThingy = new MagicPointThingy();
  @observable
  _leadingControlPointRelative: MagicPointThingy | null = null;
  @observable
  _followingControlPointRelative: MagicPointThingy | null = null;
  @observable
  areControlPointsMirrored: boolean = true;

  init(originPoint: MagicPointThingy): this {
    this.originPoint = originPoint;
    return this;
  }

  @computed
  get leadingControlPointRelative(): MagicPointThingy | null {
    return this._leadingControlPointRelative;
  }

  set leadingControlPointRelative(point: MagicPointThingy | null) {
    this._leadingControlPointRelative = point;
  }

  @computed
  get followingControlPointRelative(): MagicPointThingy | null {
    if (this.areControlPointsMirrored) {
      const leadingControlPointRelative = this.leadingControlPointRelative;
      if (!leadingControlPointRelative) return null;
      return leadingControlPointRelative.scale(-1);
    }

    return this._followingControlPointRelative;
  }

  set followingControlPointRelative(newPoint: MagicPointThingy | null) {
    if (this.areControlPointsMirrored) {
      if (newPoint) {
        this.leadingControlPointRelative = newPoint.scale(-1);
      } else {
        this.leadingControlPointRelative = null;
      }
    } else {
      this._followingControlPointRelative = newPoint;
    }
  }

  @computed
  get leadingControlPointGlobal(): MagicPointThingy | null {
    const leadingControlPointRelative = this.leadingControlPointRelative;
    if (!leadingControlPointRelative) return null;
    return this.originPoint.add(leadingControlPointRelative);
  }

  set leadingControlPointGlobal(newPoint: MagicPointThingy | null) {
    if (newPoint) {
      this.leadingControlPointRelative = newPoint.subtract(this.originPoint);
    } else {
      this.leadingControlPointRelative = null;
    }
  }

  @computed
  get followingControlPointGlobal(): MagicPointThingy | null {
    const followingControlPointRelative = this.followingControlPointRelative;
    if (!followingControlPointRelative) return null;
    return this.originPoint.add(followingControlPointRelative);
  }

  set followingControlPointGlobal(newPoint: MagicPointThingy | null) {
    if (newPoint) {
      this.followingControlPointRelative = newPoint.subtract(this.originPoint);
    } else {
      this.followingControlPointRelative = null;
    }
  }
}

serializable(ShapePoint, 'ShapePoint', ['areControlPointsMirrored'], {
  originPoint: ref(MagicPointThingy),
  _leadingControlPointRelative: ref(MagicPointThingy),
  _followingControlPointRelative: ref(MagicPointThingy),
});

export default ShapePoint;
