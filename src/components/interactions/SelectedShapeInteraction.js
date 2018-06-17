// @flow
import React, { Fragment } from 'react';
import pink from '@material-ui/core/colors/pink';
import * as PointHelpers from '../../canvas/PointHelpers';
import type Editor from '../../models/editor/Editor';
import type Shape from '../../models/document/shapes/Shape';
import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';
import DraggablePoint from '../DraggablePoint';
import { withViewport } from '../lib/ViewportProvider';

type Props = {
  editor: Editor,
  shape: Shape,
  viewport: Viewport,
};

class SelectedShapeInteraction extends React.Component<Props> {
  drawLine = (ctx: CanvasRenderingContext2D, { px, basePoint }: Viewport) => {
    ctx.lineWidth = px;
    ctx.strokeStyle = pink.A400;
    const shape = this.props.shape;
    ctx.stroke(shape.getCanvasPathAtBasePoint(basePoint));
  };

  drawPoint = (ctx: CanvasRenderingContext2D, { px }: Viewport) => {
    ctx.fillStyle = pink.A400;
    ctx.beginPath();
    PointHelpers.square(ctx, { x: 0, y: 0 }, 5);
    ctx.fill();
  };

  handleClick = () => {
    this.props.editor.clearState();
  };

  render() {
    const { shape } = this.props;
    return (
      <Fragment>
        <ViewportCanvas draw={this.drawLine} onClick={this.handleClick} />
        {shape.points.map(point => (
          <DraggablePoint
            key={String(point.id)}
            point={point}
            color={pink.A400}
            cursor="pointer"
          />
        ))}
      </Fragment>
    );
  }
}

export default withViewport(SelectedShapeInteraction);
