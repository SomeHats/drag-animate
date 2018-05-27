// @flow
import React from 'react';
import ViewportCanvas from '../lib/ViewportCanvas';
import type Scene from '../../models/document/Scene';
import type { ViewportContext } from '../lib/ViewportProvider';

type Props = {
  scene: Scene,
};

class GridCanvas extends React.Component<Props> {
  draw = (ctx: CanvasRenderingContext2D, { px }: ViewportContext) => {
    this.drawOutline(ctx, px);
    // this.drawGridLines(ctx, px);
  };

  drawOutline(ctx: CanvasRenderingContext2D, px: number) {
    const { scene } = this.props;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = px;
    ctx.strokeRect(0, 0, scene.width, scene.height);
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
