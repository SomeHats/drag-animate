// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type Shape from '../../models/document/shapes/Shape';
import ViewportCanvas from '../lib/ViewportCanvas';

type Props = {
  shape: Shape,
};

class ShapeRenderer extends React.Component<Props> {
  draw = (ctx: CanvasRenderingContext2D) => {
    const { shape } = this.props;
    shape.drawToCanvas(ctx);
  };

  render() {
    return <ViewportCanvas draw={this.draw} />;
  }
}

export default observer(ShapeRenderer);
