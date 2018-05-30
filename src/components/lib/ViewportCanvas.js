// @flow
import * as React from 'react';
import invariant from 'invariant';
import { withStyles } from '@material-ui/core/styles';
import { ViewportConsumer, type Viewport } from './ViewportProvider';
import Canvas from './Canvas';

export type { Viewport } from './ViewportProvider';

const styles = theme => ({
  container: {
    position: 'absolute',
    top: 64,
    width: 'calc(100% - 300px)',
  },
});

type ViewportMouseEvent = (
  SyntheticMouseEvent<HTMLCanvasElement>,
  Viewport
) => mixed;

type RequiredProps = {
  draw: (CanvasRenderingContext2D, Viewport) => void,
  cursor?: string,
  onMouseDown?: ViewportMouseEvent,
  onMouseUp?: ViewportMouseEvent,
  onMouseMove?: ViewportMouseEvent,
  onClick?: ViewportMouseEvent,
};

type Props = RequiredProps & {
  viewport: Viewport,
  classes: { [string]: string },
};

class _ViewportCanvas extends React.Component<Props, void> {
  windowCoordsToSceneCoords(x: number, y: number) {
    const { panX, panY, zoom } = this.props.viewport;
    return {
      x: (x - panX) / zoom,
      y: (y - 64 - panY) / zoom,
    };
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, draw } = this.props;
    const { panX, panY, zoom } = viewport;

    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    draw(ctx, viewport);
  };

  handleMouseDown = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (this.props.onMouseDown) this.props.onMouseDown(e, this.props.viewport);
  };
  handleMouseMove = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (this.props.onMouseMove) this.props.onMouseMove(e, this.props.viewport);
  };
  handleMouseUp = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (this.props.onMouseUp) this.props.onMouseUp(e, this.props.viewport);
  };
  handleClick = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (this.props.onClick) this.props.onClick(e, this.props.viewport);
  };

  render() {
    const {
      classes,
      viewport,
      cursor,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onClick,
    } = this.props;
    const { pxWidth, pxHeight } = viewport;
    return (
      <Canvas
        className={classes.container}
        style={cursor != null ? { cursor } : undefined}
        draw={this.draw}
        width={pxWidth}
        height={pxHeight}
        onMouseDown={onMouseDown ? this.handleMouseDown : undefined}
        onMouseMove={onMouseMove ? this.handleMouseMove : undefined}
        onMouseUp={onMouseUp ? this.handleMouseUp : undefined}
        onClick={onClick ? this.handleClick : undefined}
      />
    );
  }
}

const ViewportCanvas = withStyles(styles)(_ViewportCanvas);

export default (props: RequiredProps) => (
  <ViewportConsumer>
    {viewport => {
      invariant(viewport, 'viewport must be present');
      return <ViewportCanvas {...props} viewport={viewport} />;
    }}
  </ViewportConsumer>
);
