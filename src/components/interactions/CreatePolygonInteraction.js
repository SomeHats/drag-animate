// @flow
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import pink from '@material-ui/core/colors/pink';
import lightGreen from '@material-ui/core/colors/lightGreen';

import ViewportCanvas, { type ViewportContext } from '../lib/ViewportCanvas';
import type { CreatePolygonShape } from '../../models/editor/EditorState';
import Vector2 from '../../models/Vector2';
import type Editor from '../../models/editor/Editor';
import * as PointHelpers from '../../canvas/PointHelpers';

type Props = {
  editorState: CreatePolygonShape,
  editor: Editor,
};

const SNAP_THRESHOLD = 7;

class CreatePolygonInteraction extends React.Component<Props> {
  canvasState: {|
    extraPoint: null | Vector2,
    isSnapped: boolean,
  |} = observable({
    extraPoint: null,
    isSnapped: false,
  });

  draw = (ctx: CanvasRenderingContext2D, { px }: ViewportContext) => {
    const shape = this.props.editorState.shape;
    const { extraPoint, isSnapped } = this.canvasState;

    ctx.beginPath();
    shape.points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    const firstPoint = shape.points.length ? shape.points[0] : null;
    if (extraPoint && firstPoint) {
      ctx.lineTo(extraPoint.x, extraPoint.y);
    }

    ctx.strokeStyle = isSnapped ? lightGreen['A400'] : pink['A400'];
    ctx.lineWidth = px;
    ctx.stroke();

    ctx.beginPath();
    shape.points.forEach(point => {
      PointHelpers.square(ctx, point, 5 * px);
    });
    ctx.fillStyle = pink['A400'];
    ctx.fill();
  };

  handleClick = action(
    (e: SyntheticMouseEvent<HTMLCanvasElement>, viewport: ViewportContext) => {
      const { extraPoint, isSnapped } = this.canvasState;
      if (isSnapped) {
        this.props.editorState.shape.close();
        this.props.editor.clearState();
      } else if (extraPoint) {
        this.props.editorState.shape.addPoint(extraPoint);
      }
    }
  );

  handleMouseMove = action(
    (e: SyntheticMouseEvent<HTMLCanvasElement>, viewport: ViewportContext) => {
      const extraPoint = viewport.screenCoordsToSceneCoords({
        x: e.clientX,
        y: e.clientY,
      });

      const points = this.props.editorState.shape.points;
      let isSnapped = false;
      if (points.length > 2) {
        const firstPoint = points[0];
        const screenFirstPoint = viewport.sceneCoordsToScreenCoords(firstPoint);
        const screenExtraPoint = viewport.sceneCoordsToScreenCoords(extraPoint);
        if (screenFirstPoint.distanceTo(screenExtraPoint) < SNAP_THRESHOLD) {
          extraPoint.set(firstPoint);
          isSnapped = true;
        }
      }

      this.canvasState.extraPoint = extraPoint;
      this.canvasState.isSnapped = isSnapped;
    }
  );

  render() {
    return (
      <ViewportCanvas
        cursor="crosshair"
        draw={this.draw}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}

export default observer(CreatePolygonInteraction);
