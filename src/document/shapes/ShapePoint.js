// @flow
import { decorate, observable } from 'mobx';
import { genId, serializable, ref } from '../../lib/serialize';
import MagicPointThingy from '../MagicPointThingy';

class ShapePoint {
  id = genId();
  originPoint: MagicPointThingy;
  _leadingControlPoint: MagicPointThingy | null = null;
  _followingControlPoint: MagicPointThingy | null = null;
  lockedControlPoints: boolean = true;

  init(originPoint: MagicPointThingy): this {
    this.originPoint = originPoint;
    return this;
  }
}

serializable(ShapePoint, 'ShapePoint', ['lockedControlPoints'], {
  originPoint: ref(MagicPointThingy),
  _leadingControlPoint: ref(MagicPointThingy),
  _followingControlPoint: ref(MagicPointThingy),
});

export default decorate(ShapePoint, {
  origin: observable,
  _leadingControlPoint: observable,
  _followingControlPoint: observable,
  lockedControlPoints: observable,
});
