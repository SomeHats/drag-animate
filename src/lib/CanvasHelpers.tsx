// @flow
import Vector2 from './Vector2';
import ShapePoint from '../document/shapes/ShapePoint';

interface Point {
  x: number;
  y: number;
}

export const squarePointPath = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  size: number,
) => {
  const halfSize = size / 2;
  ctx.moveTo(x - halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y + halfSize);
  ctx.lineTo(x - halfSize, y + halfSize);
  ctx.lineTo(x - halfSize, y - halfSize);
};

export const circlePointPath = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  size: number,
) => {
  const radius = size / 2;
  ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
};

export const drawSquarePoint = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  size: number,
  options: { fill?: boolean } = {},
) => {
  const { fill } = { fill: false, ...options };
  ctx.beginPath();
  squarePointPath(ctx, point, size);
  if (fill) {
    ctx.fill();
  } else {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
  }
};

export const drawControlPoint = (
  ctx: CanvasRenderingContext2D,
  originPoint: Point,
  controlPoint: Point,
  size: number,
  options: { fill?: boolean } = {},
) => {
  const { fill } = { fill: false, ...options };
  ctx.beginPath();
  ctx.moveTo(originPoint.x, originPoint.y);
  ctx.lineTo(controlPoint.x, controlPoint.y);
  ctx.stroke();
  ctx.beginPath();
  circlePointPath(ctx, controlPoint, size);
  if (fill) {
    ctx.fill();
  } else {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
  }
};

export const drawShapePointWithControlPoints = (
  ctx: CanvasRenderingContext2D,
  point: ShapePoint,
  basePoint: Vector2,
  size: number,
  options: {
    fillOrigin?: boolean;
    fillLeadingControl?: boolean;
    fillFollowingControl?: boolean;
  } = {},
) => {
  const { fillOrigin, fillLeadingControl, fillFollowingControl } = {
    fillOrigin: false,
    fillLeadingControl: false,
    fillFollowingControl: false,
    ...options,
  };
  const originPoint = point.originPoint.getAtBasePoint(basePoint);
  if (point.leadingControlPointGlobal) {
    drawControlPoint(
      ctx,
      originPoint,
      point.leadingControlPointGlobal.getAtBasePoint(basePoint),
      size,
      { fill: fillLeadingControl },
    );
  }
  if (point.followingControlPointGlobal) {
    drawControlPoint(
      ctx,
      originPoint,
      point.followingControlPointGlobal.getAtBasePoint(basePoint),
      size,
      { fill: fillFollowingControl },
    );
  }
  drawSquarePoint(ctx, originPoint, size, { fill: fillOrigin });
};

export const keyPointPath = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  isActive: boolean,
  scale: number,
) => {
  ctx.beginPath();

  // main cirle
  ctx.arc(x, y, 10 * scale, 0, 2 * Math.PI, true);

  // cross hairs
  ctx.moveTo(x - 15 * scale, y);
  ctx.lineTo(x - 5 * scale, y);
  ctx.moveTo(x + 5 * scale, y);
  ctx.lineTo(x + 15 * scale, y);
  ctx.moveTo(x, y - 15 * scale);
  ctx.lineTo(x, y - 5 * scale);
  ctx.moveTo(x, y + 5 * scale);
  ctx.lineTo(x, y + 15 * scale);

  // cross hair serifs
  if (isActive) {
    ctx.moveTo(x - 14.5 * scale, y - 2.5 * scale);
    ctx.lineTo(x - 14.5 * scale, y + 2.5 * scale);
    ctx.moveTo(x + 14.5 * scale, y - 2.5 * scale);
    ctx.lineTo(x + 14.5 * scale, y + 2.5 * scale);
    ctx.moveTo(x - 2.5 * scale, y - 14.5 * scale);
    ctx.lineTo(x + 2.5 * scale, y - 14.5 * scale);
    ctx.moveTo(x - 2.5 * scale, y + 14.5 * scale);
    ctx.lineTo(x + 2.5 * scale, y + 14.5 * scale);
  }
};

export const getShapePath = (
  points: ShapePoint[],
  basePoint: Vector2,
  isClosed: boolean,
) => {
  const path = new Path2D();

  const addLineSegment = (prevPoint: ShapePoint, point: ShapePoint) => {
    const { x, y } = point.originPoint.getAtBasePoint(basePoint);
    const prevControlPoint = prevPoint.leadingControlPointGlobal;
    const currControlPoint = point.followingControlPointGlobal;

    if (prevControlPoint && currControlPoint) {
      const { x: cp1x, y: cp1y } = prevControlPoint.getAtBasePoint(basePoint);
      const { x: cp2x, y: cp2y } = currControlPoint.getAtBasePoint(basePoint);
      path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    } else if (prevControlPoint) {
      const { x: cpx, y: cpy } = prevControlPoint.getAtBasePoint(basePoint);
      path.quadraticCurveTo(cpx, cpy, x, y);
    } else if (currControlPoint) {
      const { x: cpx, y: cpy } = currControlPoint.getAtBasePoint(basePoint);
      path.quadraticCurveTo(cpx, cpy, x, y);
    } else {
      path.lineTo(x, y);
    }
  };

  points.forEach((point, i) => {
    if (i === 0) {
      const { x, y } = point.originPoint.getAtBasePoint(basePoint);
      path.moveTo(x, y);
    } else {
      addLineSegment(points[i - 1], point);
    }
  });

  if (isClosed) {
    addLineSegment(points[points.length - 1], points[0]);
    path.closePath();
  }

  return path;
};
