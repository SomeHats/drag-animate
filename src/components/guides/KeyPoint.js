// @flow
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import CanvasInViewport from '../lib/CanvasInViewport';
import { withViewport, type Viewport } from '../lib/ViewportProvider';
import type Vector2 from '../../models/Vector2';

type Props = {
  keyPoint: Vector2,
  viewport: Viewport,
};

type State = {
  isHovering: boolean,
};

class KeyPoint extends React.Component<Props, State> {
  state = {
    isHovering: false,
  };

  draw = (ctx: CanvasRenderingContext2D, { nearestKeyPoint }: Viewport) => {
    const { isHovering } = this.state;
    const isActive = nearestKeyPoint === this.props.keyPoint;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI, true);
    ctx.moveTo(-15, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(5, 0);
    ctx.lineTo(15, 0);
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -5);
    ctx.moveTo(0, 5);
    ctx.lineTo(0, 15);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isActive
      ? 'rgb(0, 255, 255)'
      : isHovering
        ? 'rgba(255, 0, 255, 1)'
        : 'rgba(255, 0, 255, 0.5)';
    ctx.stroke();
  };

  handleMouseEnter = () => this.setState({ isHovering: true });
  handleMouseLeave = () => this.setState({ isHovering: false });

  handleClick = action((e, viewport: Viewport) => {
    this.props.viewport.basePoint.set(this.props.keyPoint);
  });

  render() {
    const { keyPoint } = this.props;
    return (
      <CanvasInViewport
        draw={this.draw}
        width={30}
        height={30}
        sceneX={keyPoint.x}
        sceneY={keyPoint.y}
        cursor="pointer"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      />
    );
  }
}

export default withViewport(observer(KeyPoint));
