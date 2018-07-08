// @flow
import * as React from 'react';
import invariant from 'invariant';
import { observer } from 'mobx-react';
import type Vector2 from '../../lib/Vector2';
import withExactProps from '../../lib/withExactProps';
import { withViewport, type Viewport } from './ViewportProvider';
import Canvas from '../canvas/Canvas';

export type { Viewport } from './ViewportProvider';

type ViewportMouseEvent = Viewport => mixed;

type Props = {
  draw: (CanvasRenderingContext2D, Viewport) => void,
  cursor?: string,
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
    const { viewport, cursor, canvasRef, contextRef } = this.props;
    const { pxWidth, pxHeight, left, top } = viewport;
    return (
      <Canvas
        style={{
          position: 'absolute',
          left,
          top,
          cursor: cursor == null ? undefined : cursor,
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
