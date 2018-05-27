// @flow
import { decorate, observable } from 'mobx';

class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  set(other: Vector2) {
    this.x = other.x;
    this.y = other.y;
  }
}

export default decorate(Vector2, {
  x: observable,
  y: observable,
});
