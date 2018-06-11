// @flow
import { decorate, observable } from 'mobx';
import { genId, serializable } from './serialize';

class Vector2 {
  id = genId();
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

  findNearest(others: Vector2[]): Vector2 | null {
    let nearest = null;
    let nearestDistance = Infinity;
    others.forEach(point => {
      const distance = this.distanceTo(point);
      if (distance < nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    });
    return nearest;
  }
}

serializable(Vector2, 'Vector2', ['x', 'y']);

decorate(Vector2, {
  x: observable,
  y: observable,
});

export default Vector2;
