// @flow
import React from 'react';
import { observer } from 'mobx-react';
import Shape from '../../document/shapes/Shape';
import ViewportCanvas, { Viewport } from '../viewport/ViewportCanvas';

interface ShapeRendererProps {
  shape: Shape;
}

class ShapeRenderer extends React.Component<ShapeRendererProps> {
  draw = (ctx: CanvasRenderingContext2D, { basePoint }: Viewport) => {
    const { shape } = this.props;
    shape.drawToCanvasAtBasePoint(ctx, basePoint);
  };

  render() {
    return <ViewportCanvas draw={this.draw} />;
  }
}

export default observer(ShapeRenderer);
