// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import withExactProps from '../../lib/withExactProps';
import { withViewport, type Viewport } from './ViewportProvider';
import Canvas from '../canvas/Canvas';

export type { Viewport } from './ViewportProvider';

type Props = {
  draw: (CanvasRenderingContext2D, Viewport) => void,
  width: number,
  height: number,
  sceneX: number,
  sceneY: number,
  viewport: Viewport,
  classes: { [string]: string },
};

const styles = {
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
};

class CanvasInViewport extends React.Component<Props> {
  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, width, height, draw } = this.props;
    ctx.translate(width / 2, height / 2);
    draw(ctx, viewport);
  };

  render() {
    const { width, height, sceneX, sceneY, viewport, classes } = this.props;

    const { panX, panY, zoom, left, top } = viewport;
    const x = sceneX * zoom + panX - width / 2 + left;
    const y = sceneY * zoom + panY - height / 2 + top;

    return (
      <Canvas
        draw={this.draw}
        className={classes.canvas}
        width={width}
        height={height}
        style={{ transform: `translate(${x}px, ${y}px)` }}
      />
    );
  }
}

export default withExactProps(
  withViewport(withStyles(styles)(observer(CanvasInViewport)))
);
