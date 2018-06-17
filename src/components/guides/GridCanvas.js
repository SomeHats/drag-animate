// @flow
import React from 'react';
import amber from '@material-ui/core/colors/amber';
import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';
import type Vector2 from '../../models/Vector2';

class GridCanvas extends React.Component<{}> {
  draw = (ctx: CanvasRenderingContext2D, viewport: Viewport) => {
    this.drawOutline(ctx, viewport);
    this.drawBasePoint(ctx, viewport);
  };

  drawOutline(
    ctx: CanvasRenderingContext2D,
    { px, sceneWidth, sceneHeight }: Viewport
  ) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = px;
    ctx.strokeRect(0, 0, sceneWidth, sceneHeight);
  }

  drawBasePoint(
    ctx: CanvasRenderingContext2D,
    {
      basePoint,
      px,
      top,
      left,
      windowWidth,
      windowHeight,
      bottom,
      right,
      screenCoordsToSceneCoords,
    }: Viewport
  ) {
    const topLeft = screenCoordsToSceneCoords(left, top);
    const bottomRight = screenCoordsToSceneCoords(
      windowWidth - right,
      windowHeight - bottom
    );

    ctx.beginPath();
    ctx.moveTo(topLeft.x, basePoint.y);
    ctx.lineTo(bottomRight.x, basePoint.y);
    ctx.moveTo(basePoint.x, topLeft.y);
    ctx.lineTo(basePoint.x, bottomRight.y);

    ctx.lineWidth = px;
    ctx.strokeStyle = amber.A400;
    ctx.stroke();
  }

  render() {
    return <ViewportCanvas draw={this.draw} />;
  }
}

export default GridCanvas;
