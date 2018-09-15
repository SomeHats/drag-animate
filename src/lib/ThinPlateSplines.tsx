import Vector2 from './Vector2';
import TPS from './TPS';

export default class ThinPlateSplines {
  tps = new TPS();

  constructor(centers: Vector2[], values: number[]) {
    this.tps.compile(centers.map(({ x, y }) => [x, y]), values);
  }

  getValue(point: Vector2): number {
    return this.tps.getValue([point.x, point.y]);
  }
}
