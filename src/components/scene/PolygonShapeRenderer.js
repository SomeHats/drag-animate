// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type PolygonShape from '../../models/document/shapes/PolygonShape';
import ViewportCanvas from '../lib/ViewportCanvas';

type Props = {
  shape: PolygonShape,
};

class PolygonShapeRenderer extends React.Component<Props> {
  draw = (ctx: CanvasRenderingContext2D) => {
    const { shape } = this.props;
    ctx.beginPath();
    shape.points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    if (shape.isClosed) {
      ctx.closePath();
    }
    shape.style.drawCurrentContextPath(ctx);
  };

  render() {
    return <ViewportCanvas draw={this.draw} />;
  }
}

export default observer(PolygonShapeRenderer);
