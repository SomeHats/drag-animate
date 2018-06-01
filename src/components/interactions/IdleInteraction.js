// @flow
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import invariant from 'invariant';
import blue from '@material-ui/core/colors/blue';

import * as PointHelpers from '../../canvas/PointHelpers';
import type Editor from '../../models/editor/Editor';
import PolygonShape from '../../models/document/shapes/PolygonShape';
import Vector2 from '../../models/Vector2';
import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';

type Props = { editor: Editor };

// TODO: pull this out somewhere
const LINE_HOVER_DIST = 4;

class IdleInteraction extends React.Component<Props> {
  ctx: null | CanvasRenderingContext2D = null;

  draw = (ctx: CanvasRenderingContext2D, { px }: Viewport) => {
    console.log('draw');
    ctx.lineWidth = px;
    ctx.strokeStyle = blue.A400;
    this.props.editor.hoveredShapes.forEach(shape => {
      ctx.stroke(shape.canvasPath);
      if (shape instanceof PolygonShape) {
        ctx.beginPath();
        shape.points.forEach(point => {
          PointHelpers.square(ctx, point, 5 * px);
        });
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.stroke();
      }
    });
  };

  handleMouseMove = (
    e: SyntheticMouseEvent<HTMLCanvasElement>,
    viewport: Viewport
  ) => {
    const ctx = this.ctx;
    invariant(ctx, 'ctx must exist');

    const position = viewport.screenCoordsToSceneCoords({
      x: e.clientX,
      y: e.clientY,
    });

    const { editor } = this.props;
    ctx.lineWidth = LINE_HOVER_DIST * viewport.px;
    const hoverShapes = editor.scene.shapes.filter(shape => {
      const path = shape.canvasPath;
      return ctx.isPointInStroke(path, position.x, position.y);
    });

    // console.log('mm', hoverShapes);
    editor.setHovers(hoverShapes);
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
        cursor={
          this.props.editor.hoveredShapes.length > 0 ? 'pointer' : 'default'
        }
      />
    );
  }
}

export default observer(IdleInteraction);
