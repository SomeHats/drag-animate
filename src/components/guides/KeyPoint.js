// @flow
import React from 'react';
import { observer } from 'mobx-react';
import deepOrange from '@material-ui/core/colors/deepOrange';
import green from '@material-ui/core/colors/green';
import withExactProps from '../../lib/withExactProps';
import CanvasInViewport from '../viewport/CanvasInViewport';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import type Vector2 from '../../lib/Vector2';
import { keyPointPath } from '../../lib/CanvasHelpers';

type Props = {
  keyPoint: Vector2,
  viewport: Viewport,
};

class KeyPoint extends React.Component<Props> {
  draw = (
    ctx: CanvasRenderingContext2D,
    { nearestKeyPoint, keyboard }: Viewport,
  ) => {
    const isActive = nearestKeyPoint === this.props.keyPoint;

    keyPointPath(ctx, { x: 0, y: 0 }, isActive, 1);

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
