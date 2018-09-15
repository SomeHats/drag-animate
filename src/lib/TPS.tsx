// @ts-nocheck

require('sylvester');

var TPS = function(this: any) {
  var centers: any, ws: any, ys: any;

  var distance = function(pnt1: any, pnt2: any) {
    var sum = 0;
    if (!pnt1.length) return Math.sqrt(Math.pow(pnt1 - pnt2, 2));
    for (var i = 0; i < pnt1.length; i++) {
      sum += Math.pow(pnt1[i] - pnt2[i], 2);
    }
    return Math.sqrt(sum);
  };

  //this is going to be a thin-plate spline
  //f(x,y) = a1 + a2x + a3y + SUM(wi * kernel())
  var kernel = function(pnt1: any, pnt2: any) {
    var r = distance(pnt1, pnt2);
    if (r === 0) return 0;
    return Math.pow(r, 2) * Math.log(r);
  };

  this.compile = function(cents: any, y_vals: any) {
    centers = cents.map(function(curr: any) {
      return curr;
    });
    ys = y_vals.map(function(curr: any) {
      return curr;
    });
    var matrix: any = [],
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

    var pT = (global as any).$M(P).transpose();

    var newRows = pT.elements.map(function(row: any) {
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
  };

  this._solve = function(b: any, x: any) {
    //a*x = b
    //a = b * x^-1
    //L = [K p]
    //    [pT 0]
    //L (W | a1 a2 a3) = Y
    var X = (global as any).$M(x);
    var B = (global as any).$V(b);
    X = X.inverse();
    if (!X) {
      return;
    }
    return X.multiply(B);
  };

  this.getValue = function(pnt: any) {
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

  this.getValues = function(pnts: any, cb: any) {
    setTimeout(
      function(this: any) {
        var resultArr = pnts.map(function(this: any, pnt: any) {
          return this.getValue(pnt);
        }, this);
        cb(null, { points: pnts, ys: resultArr });
      }.bind(this),
      0,
    );
  };
};

export default TPS as any;
