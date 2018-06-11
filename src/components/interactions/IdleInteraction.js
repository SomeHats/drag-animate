// @flow
import React from 'react';
import { observer } from 'mobx-react';
import invariant from 'invariant';
import blue from '@material-ui/core/colors/blue';

import * as PointHelpers from '../../canvas/PointHelpers';
import type Editor from '../../models/editor/Editor';
import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';

type Props = { editor: Editor };

// TODO: pull this out somewhere
const LINE_HOVER_DIST = 4;

class IdleInteraction extends React.Component<Props> {
  ctx: null | CanvasRenderingContext2D = null;

  draw = (ctx: CanvasRenderingContext2D, { px, basePoint }: Viewport) => {
    ctx.lineWidth = px;
    ctx.strokeStyle = blue.A400;
    this.props.editor.hoveredShapes.forEach(shape => {
      ctx.stroke(shape.getCanvasPathAtBasePoint(basePoint));
      ctx.beginPath();
      shape.points.forEach(point => {
        PointHelpers.square(ctx, point.getAtBasePoint(basePoint), 5 * px);
      });
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.stroke();
    });
  };

  handleMouseMove = (
    e: SyntheticMouseEvent<HTMLCanvasElement>,
    { px, basePoint, screenCoordsToSceneCoords }: Viewport
  ) => {
    const ctx = this.ctx;
    invariant(ctx, 'ctx must exist');

    const position = screenCoordsToSceneCoords(e.clientX, e.clientY);

    const { editor } = this.props;
    ctx.lineWidth = LINE_HOVER_DIST * px;
    const hoverShapes = editor.scene.shapes.filter(shape => {
      const path = shape.getCanvasPathAtBasePoint(basePoint);
      return ctx.isPointInStroke(path, position.x, position.y);
    });

    editor.setHovers(hoverShapes);
  };

  handleClick = () => {
    const { editor } = this.props;
    const shapeToSelect = editor.hoveredShapes[0];
    if (shapeToSelect) {
      editor.commands.selectShape(shapeToSelect);
    }
  };

  contextRef = (ctx: CanvasRenderingContext2D | null) => {
    this.ctx = ctx;
  };

  render() {
    return (
      <ViewportCanvas
        contextRef={this.contextRef}
        draw={this.draw}
        onMouseMove={this.handleMouseMove}
        onClick={this.handleClick}
        cursor={
          this.props.editor.hoveredShapes.length > 0 ? 'pointer' : 'default'
        }
      />
    );
  }
}

export default observer(IdleInteraction);
