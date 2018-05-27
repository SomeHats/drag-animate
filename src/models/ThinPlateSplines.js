// @flow
// adapted from https://github.com/GMTurbo/tps/blob/master/thinplate.js
import invariant from 'invariant';
import Matrix from 'sylvester/lib/node-sylvester/matrix';
import Vector from 'sylvester/lib/node-sylvester/vector';
import { observable, computed, decorate } from 'mobx';
import Vector2 from './Vector2';

class ThinPlateSplines2 {
  sourcePoints: Vector2[] = [];
  targetValues: number[] = [];

  _kernel(point1: Vector2, point2: Vector2): number {
    const r = point1.distanceTo(point2);
    if (r === 0) return 0;
    return r * r * Math.log(r);
  }

  _solve(ys: number[], matrix: number[][]): number[] {
    const ysVec = new Vector(ys);
    const matrixInverse = new Matrix(matrix).inverse();
    invariant(matrixInverse, 'matrix inverse must exist');
    return matrixInverse.multiply(ys).elements;
  }

  get ws(): number[] {
    const { sourcePoints, targetValues } = this;
    invariant(sourcePoints && sourcePoints.length, 'sources must not be empty');

    const matrix: number[][] = [];
    const P: number[][] = [];

    for (let i = 0; i < sourcePoints.length; i++) {
      const sourcePoint = sourcePoints[i];
      const matrixRow = [];
      const pRow = [1, sourcePoint.x, sourcePoint.y];

      for (let j = 0; j < sourcePoints.length; j++) {
        matrixRow.push(this._kernel(sourcePoint, sourcePoints[j]));
      }

      P.push(pRow);
      matrix.push(matrixRow.concat(pRow));
    }

    var pTransposed = new Matrix(P).transpose();
    const newRows = pTransposed.map(row =>
      row.concat(new Array(matrix[0].length).fill(0))
    );

    const ys = targetValues.slice();
    for (let i = 0; i < newRows.length; i++) {
      matrix.push(newRows[i]);
      ys.push(0);
    }

    const ws = this._solve(ys, matrix);
    return ws;
  }

  getValue(point: Vector2): number {
    const { sourcePoints, ws } = this;
    let result = 0;
    for (let i = 0; i < sourcePoints.length; i++) {
      result += ws[i] * this._kernel(point, sourcePoints[i]);
    }
    result += ws[sourcePoints.length];

    result += point.x * Number(ws[sourcePoints.length + 1]);
    result += point.y * Number(ws[sourcePoints.length + 2]);
    return result;
  }
}

export default decorate(ThinPlateSplines2, {
  sourcePoints: observable,
  targetValues: observable,
  ws: computed,
});
