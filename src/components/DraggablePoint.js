// @flow
import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PointableCover from '../lib/PointableCover';
import type Vector2 from '../models/Vector2';
import * as PointHelpers from '../canvas/PointHelpers';
import CanvasInViewport from './lib/CanvasInViewport';
import { withViewport, type Viewport } from './lib/ViewportProvider';

type Props = {
  color: string,
  point: Vector2,
  cursor?: string,
  viewport: Viewport,
};

class DraggablePoint extends React.Component<Props> {
  cover: PointableCover;

  componentDidMount() {
    this.cover = new PointableCover({
      down: this.handleMouseDown,
      move: this.handleMouseMove,
      up: this.handleMouseUp,
    });
  }

  handleMouseDown = e => {
    this.cover.attach();
  };

  handleMouseMove = action(e => {
    const point = this.props.viewport.screenCoordsToSceneCoords(
      e.clientX,
      e.clientY
    );

    this.props.point.set(point);
  });

  handleMouseUp = e => {
    this.cover.remove();
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    PointHelpers.square(ctx, { x: 0, y: 0 }, 5);
    ctx.fillStyle = this.props.color;
    ctx.fill();
  };

  render() {
    const { point, cursor } = this.props;
    return (
      <CanvasInViewport
        width={15}
        height={15}
        sceneX={point.x}
        sceneY={point.y}
        draw={this.draw}
        cursor={cursor}
        onMouseDown={this.handleMouseDown}
      />
    );
  }
}

export default withViewport(observer(DraggablePoint));
