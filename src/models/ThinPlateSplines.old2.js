// @flow
import invariant from 'invariant';
import Vector2 from './Vector2';
import Matrix from 'sylvester/lib/node-sylvester/matrix';
import Vector from 'sylvester/lib/node-sylvester/vector';
global.$V = Vector.create;

const kernel = (a: Vector2, b: Vector2): number => {
  const r = a.distanceTo(b);
  if (r === 0) return 0;
  return Math.pow(r, 2) * Math.log(r);
};

class ThinPlateSplines2 {
  centers: Vector2[];
  ws: number[];
  ys: number[];

  constructor(cents: Vector2[], yVals: number[]) {
    invariant(cents.length > 0, 'must be at least one center');
    invariant(
      cents.length === yVals.length,
      'must be matching centers and yValues'
    );

    this.centers = cents.slice();
    this.ws = [];
    this.ys = yVals.slice();

    for (let i = this.centers.length; i < 2; i++) {
      this.centers.push(
        new Vector2(this.centers[0].x + i, this.centers[0].y + i)
      );
      this.ys.push(this.ys[0]);
    }

    const matrix = [];
    const P = [];
    for (let i = 0; i < this.centers.length; i++) {
      const matRow = [];
      const pRow = [1, this.centers[i].x, this.centers[i].y];

      for (let j = 0; j < this.centers.length; j++) {
        matRow.push(kernel(this.centers[i], this.centers[j]));
      }
      P.push(pRow);
      matrix.push(matRow.concat(pRow));
    }

    const pT = Matrix.create(P).transpose();

    const newRows = pT.elements.map(function(row) {
      for (let i = row.length; i < matrix[0].length; i++) {
        row.push(0);
      }
      return row;
    });

    for (let i = 0; i < newRows.length; i++) {
      matrix.push(newRows[i]);
      this.ys.push(0);
    }

    this.ws = this._solve(this.ys, matrix);

    invariant(this.ws, 'rbf failed - centers must be unique');
  }

  _solve(b: number[], x: number[][]) {
    //a*x = b
    //a = b * x^-1
    //L = [K p]
    //    [pT 0]
    //L (W | a1 a2 a3) = Y
    let X = Matrix.create(x);
    let B = Vector.create(b);
    X = X.inverse();
    invariant(X, 'could not invert matrix');
    return X.multiply(B).elements;
  }

  getValue(pnt: Vector2) {
    let result = 0;
    for (let i = 0; i < this.centers.length; i++) {
      result += Number(this.ws[i]) * kernel(pnt, this.centers[i]);
    }
    result += Number(this.ws[this.centers.length]);
    result += pnt.x * Number(this.ws[this.centers.length + 1]);
    result += pnt.y * Number(this.ws[this.centers.length + 2]);
    return result;
  }
}

export default ThinPlateSplines2;
