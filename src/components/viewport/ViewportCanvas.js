// @flow
import * as React from 'react';
import { observer } from 'mobx-react';
import withExactProps from '../../lib/withExactProps';
import { withViewport, type Viewport } from './ViewportProvider';
import Canvas from '../canvas/Canvas';

export type { Viewport } from './ViewportProvider';

type Props = {
  draw: (CanvasRenderingContext2D, Viewport) => void,
  canvasRef?: (HTMLCanvasElement | null) => void,
  contextRef?: (CanvasRenderingContext2D | null) => void,
  viewport: Viewport,
};

class ViewportCanvas extends React.Component<Props, void> {
  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, draw } = this.props;
    const { panX, panY, zoom } = viewport;

    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    draw(ctx, viewport);
  };

  render() {
    const { viewport, canvasRef, contextRef } = this.props;
    const { pxWidth, pxHeight, left, top } = viewport;
    return (
      <Canvas
        style={{
          position: 'absolute',
          left,
          top,
        }}
        draw={this.draw}
        width={pxWidth}
        height={pxHeight}
        canvasRef={canvasRef}
        contextRef={contextRef}
      />
    );
  }
}

export default withExactProps(withViewport(observer(ViewportCanvas)));
