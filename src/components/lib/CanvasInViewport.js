// @flow
import React from 'react';
import invariant from 'invariant';
import { withStyles } from '@material-ui/core/styles';
import { ViewportConsumer, type Viewport } from './ViewportProvider';
import Canvas from './Canvas';

type RequiredProps = {
  draw: (CanvasRenderingContext2D, Viewport) => void,
  width: number,
  height: number,
  sceneX: number,
  sceneY: number,
  onMouseEnter?: (SyntheticMouseEvent<HTMLCanvasElement>) => mixed,
  onMouseLeave?: (SyntheticMouseEvent<HTMLCanvasElement>) => mixed,
};

type Props = RequiredProps & {
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

class _CanvasInViewport extends React.Component<Props> {
  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, width, height, draw } = this.props;
    ctx.translate(width / 2, height / 2);
    draw(ctx, viewport);
  };

  render() {
    const {
      width,
      height,
      sceneX,
      sceneY,
      viewport,
      classes,
      onMouseEnter,
      onMouseLeave,
    } = this.props;

    const { panX, panY, zoom } = viewport;
    const x = sceneX * zoom + panX - width / 2;
    const y = sceneY * zoom + panY - height / 2 + 64;

    return (
      <Canvas
        draw={this.draw}
        className={classes.canvas}
        width={width}
        height={height}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }
}

const CanvasInViewport = withStyles(styles)(_CanvasInViewport);

export default (props: $Exact<RequiredProps>) => (
  <ViewportConsumer>
    {viewport => {
      invariant(viewport, 'viewport must be present');
      return <CanvasInViewport {...props} viewport={viewport} />;
    }}
  </ViewportConsumer>
);
