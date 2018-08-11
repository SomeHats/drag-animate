// @flow
import { decorate, observable } from "mobx";
import { genId, serializable } from "./serialize";

class Vector2 {
  id = genId();
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  distanceTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
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

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  scale(amt: number): Vector2 {
    return new Vector2(this.x * amt, this.y * amt);
  }
}

serializable(Vector2, "Vector2", ["x", "y"]);

decorate(Vector2, {
  x: observable,
  y: observable
});

export default Vector2;
