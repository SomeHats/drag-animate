// @flow
import * as React from 'react';
import { observer } from 'mobx-react';
import { withViewport, Viewport } from './ViewportProvider';
import Canvas from '../canvas/Canvas';

export { Viewport } from './ViewportProvider';

interface ViewportCanvasProps {
  draw: (ctx: CanvasRenderingContext2D, viewport: Viewport) => void;
  canvasRef?: (el: HTMLCanvasElement | null) => void;
  contextRef?: (ctx: CanvasRenderingContext2D | null) => void;
  viewport: Viewport;
}

class ViewportCanvas extends React.Component<ViewportCanvasProps> {
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

export default withViewport(observer(ViewportCanvas));
