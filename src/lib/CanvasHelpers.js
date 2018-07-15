// @flow
import Vector2 from './Vector2';
import ShapePoint from '../document/shapes/ShapePoint';

type Point = {
  x: number,
  y: number,
};

export const squarePointPath = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  size: number
) => {
  const halfSize = size / 2;
  ctx.moveTo(x - halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y + halfSize);
  ctx.lineTo(x - halfSize, y + halfSize);
  ctx.lineTo(x - halfSize, y - halfSize);
};

export const drawSquarePointOutline = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  size: number
) => {
  ctx.beginPath();
  squarePointPath(ctx, point, size);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.stroke();
};

export const getShapePath = (
  points: ShapePoint[],
  basePoint: Vector2,
  isClosed: boolean
) => {
  const path = new Path2D();
  points.forEach((point, i) => {
    const { x, y } = point.originPoint.getAtBasePoint(basePoint);
    if (i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  });
  if (isClosed) path.closePath();
  return path;
};
