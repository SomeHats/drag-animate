// @flow
import React from 'react';
import { observer } from 'mobx-react';
import deepOrange from '@material-ui/core/colors/deepOrange';
import green from '@material-ui/core/colors/green';
import withExactProps from '../../lib/withExactProps';
import CanvasInViewport from '../viewport/CanvasInViewport';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import type Vector2 from '../../lib/Vector2';

type Props = {
  keyPoint: Vector2,
  viewport: Viewport,
};

class KeyPoint extends React.Component<Props> {
  draw = (
    ctx: CanvasRenderingContext2D,
    { nearestKeyPoint, keyboard }: Viewport
  ) => {
    const isActive = nearestKeyPoint === this.props.keyPoint;

    if (!(keyboard.isPressed('ctrl') || isActive)) return;

    ctx.beginPath();
    // main cirle
    ctx.arc(0, 0, 10, 0, 2 * Math.PI, true);

    // cross hairs
    ctx.moveTo(-15, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(5, 0);
    ctx.lineTo(15, 0);
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -5);
    ctx.moveTo(0, 5);
    ctx.lineTo(0, 15);

    // cross hair serifs
    if (isActive) {
      ctx.moveTo(-14.5, -2.5);
      ctx.lineTo(-14.5, 2.5);
      ctx.moveTo(14.5, -2.5);
      ctx.lineTo(14.5, 2.5);
      ctx.moveTo(-2.5, -14.5);
      ctx.lineTo(2.5, -14.5);
      ctx.moveTo(-2.5, 14.5);
      ctx.lineTo(2.5, 14.5);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = isActive ? green.A700 : deepOrange.A400;
    ctx.stroke();
  };

  render() {
    const { keyPoint } = this.props;
    return (
      <CanvasInViewport
        draw={this.draw}
        width={30}
        height={30}
        sceneX={keyPoint.x}
        sceneY={keyPoint.y}
      />
    );
  }
}

export default withExactProps(withViewport(observer(KeyPoint)));
