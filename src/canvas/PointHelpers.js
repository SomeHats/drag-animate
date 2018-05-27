// @flow
type Point = {
  x: number,
  y: number,
};

export const square = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  size: number
) => {
  const halfSize = size / 2;
  ctx.moveTo(x - halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y + halfSize);
  ctx.lineTo(x - halfSize, y + halfSize);
};
