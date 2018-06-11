// @flow
import React from 'react';
import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';

class GridCanvas extends React.Component<{}> {
  draw = (
    ctx: CanvasRenderingContext2D,
    { px, sceneWidth, sceneHeight }: Viewport
  ) => {
    this.drawOutline(ctx, px, sceneWidth, sceneHeight);
    // this.drawGridLines(ctx, px);
  };

  drawOutline(
    ctx: CanvasRenderingContext2D,
    px: number,
    width: number,
    height: number
  ) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = px;
    ctx.strokeRect(0, 0, width, height);
  }

  // drawGridLines(ctx: CanvasRenderingContext2D, px: number) {
  //   const { scene } = this.props;
  //   ctx.beginPath();
  //   for (let x = 0; x < scene.xGridLines; x++) {
  //     const coord = x * scene.width / (scene.xGridLines - 1);
  //     ctx.moveTo(coord, 0);
  //     ctx.lineTo(coord, scene.height);
  //   }
  //   for (let y = 0; y < scene.yGridLines; y++) {
  //     const coord = y * scene.height / (scene.yGridLines - 1);
  //     ctx.moveTo(0, coord);
  //     ctx.lineTo(scene.width, coord);
  //   }
  //   ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  //   ctx.lineWidth = px;
  //   ctx.stroke();
  // }

  render() {
    return <ViewportCanvas draw={this.draw} />;
  }
}

export default GridCanvas;
