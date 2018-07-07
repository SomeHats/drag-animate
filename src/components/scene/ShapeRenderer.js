// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type Shape from '../../document/shapes/Shape';
import ViewportCanvas, { type Viewport } from '../viewport/ViewportCanvas';

type Props = {
  shape: Shape,
};

class ShapeRenderer extends React.Component<Props> {
  draw = (ctx: CanvasRenderingContext2D, { basePoint }: Viewport) => {
    const { shape } = this.props;
    shape.drawToCanvasAtBasePoint(ctx, basePoint);
  };

  render() {
    return <ViewportCanvas draw={this.draw} />;
  }
}

export default observer(ShapeRenderer);
