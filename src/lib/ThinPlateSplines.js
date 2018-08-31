// @flow
import invariant from 'invariant';
import Vector2 from './Vector2';
require('sylvester');

var TPS = function() {
  var centers, ws, ys;

  var distance = function(pnt1, pnt2) {
    var sum = 0;
    if (!pnt1.length) return Math.sqrt(Math.pow(pnt1 - pnt2, 2));
    for (var i = 0; i < pnt1.length; i++) {
      sum += Math.pow(pnt1[i] - pnt2[i], 2);
    }
    return Math.sqrt(sum);
  };

  //this is going to be a thin-plate spline
  //f(x,y) = a1 + a2x + a3y + SUM(wi * kernel())
  var kernel = function(pnt1, pnt2) {
    var r = distance(pnt1, pnt2);
    if (r === 0) return 0;
    return Math.pow(r, 2) * Math.log(r);
  };

  this.compile = function(cents, y_vals) {
    invariant(cents && cents.length, 'bad centers array :/');

    centers = cents.map(function(curr) {
      return curr;
    });
    ys = y_vals.map(function(curr) {
      return curr;
    });
    var matrix = [],
      matRow = [];
    var P = [],
      pRow = [];
    for (var i = 0; i < centers.length; i++) {
      matRow = [];
      pRow = [1];
      for (var k = 0; k < centers[i].length; k++) {
        pRow.push(centers[i][k]);
      }

      for (var j = 0; j < centers.length; j++) {
        matRow.push(kernel(centers[i], centers[j]));
      }
      P.push(pRow);
      matrix.push(matRow.concat(pRow));
    }

    var pT = global.$M(P).transpose();

    var newRows = pT.elements.map(function(row) {
      for (var i = row.length; i < matrix[0].length; i++) {
        row.push(0);
      }
      return row;
    });

    for (i = 0; i < newRows.length; i++) {
      matrix.push(newRows[i]);
      ys.push(0);
    }

    ws = this._solve(ys, matrix);

    invariant(
      ws,
      'rbf failed to compile with given centers./nCenters must be unique :/',
    );
  };

  this._solve = function(b, x) {
    //a*x = b
    //a = b * x^-1
    //L = [K p]
    //    [pT 0]
    //L (W | a1 a2 a3) = Y
    var X = global.$M(x);
    var B = global.$V(b);
    X = X.inverse();
    if (!X) {
      return;
    }
    return X.multiply(B);
  };

  this.getValue = function(pnt) {
    var result = 0,
      i = 0;
    for (i = 0; i < centers.length; i++) {
      result += Number(ws.elements[i]) * kernel(pnt, centers[i]);
    }
    result += Number(ws.elements[centers.length]);
    for (i = 0; i < pnt.length; i++) {
      result += pnt[i] * Number(ws.elements[centers.length + (i + 1)]);
    }
    return result;
  };

  this.getValues = function(pnts, cb) {
    setTimeout(
      function() {
        var resultArr = pnts.map(function(pnt) {
          return this.getValue(pnt);
        }, this);
        cb(null, { points: pnts, ys: resultArr });
      }.bind(this),
      0,
    );
  };
};

export default class ThinPlateSplines {
  tps: TPS = new TPS();

  constructor(centers: Vector2[], values: number[]) {
    this.tps.compile(centers.map(({ x, y }) => [x, y]), values);
  }

  getValue(point: Vector2) {
    return this.tps.getValue([point.x, point.y]);
  }
}
