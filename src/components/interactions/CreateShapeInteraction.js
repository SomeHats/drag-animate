// @flow
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import pink from '@material-ui/core/colors/pink';
import lightGreen from '@material-ui/core/colors/lightGreen';

import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';
import type { CreateShape } from '../../models/editor/EditorState';
import Vector2 from '../../models/Vector2';
import type Editor from '../../models/editor/Editor';
import * as PointHelpers from '../../canvas/PointHelpers';

type Props = {
  editorState: CreateShape,
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

  draw = (ctx: CanvasRenderingContext2D, { px, basePoint }: Viewport) => {
    const shape = this.props.editorState.shape;
    const { extraPoint, isSnapped } = this.canvasState;

    ctx.beginPath();
    shape.points.forEach((point, i) => {
      const { x, y } = point.getAtBasePoint(basePoint);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
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
      PointHelpers.square(ctx, point.getAtBasePoint(basePoint), 5 * px);
    });
    ctx.fillStyle = pink['A400'];
    ctx.fill();
  };

  handleClick = action(
    (
      e: SyntheticMouseEvent<HTMLCanvasElement>,
      { nearestKeyPoint }: Viewport
    ) => {
      const { extraPoint, isSnapped } = this.canvasState;
      const { editor, editorState } = this.props;
      if (isSnapped) {
        editorState.shape.close();
        editor.clearState();
      } else if (extraPoint) {
        const point = editor.scene.createMagicPointThingy();
        point.setAtKeyPoint(nearestKeyPoint, extraPoint);
        editorState.shape.addPoint(point);
      }
    }
  );

  handleMouseMove = action(
    (
      e: SyntheticMouseEvent<HTMLCanvasElement>,
      {
        basePoint,
        sceneCoordsToScreenCoords,
        screenCoordsToSceneCoords,
      }: Viewport
    ) => {
      let extraPoint = screenCoordsToSceneCoords(e.clientX, e.clientY);

      const points = this.props.editorState.shape.points;
      let isSnapped = false;
      if (points.length > 2) {
        const firstPoint = points[0].getAtBasePoint(basePoint);
        const screenFirstPoint = sceneCoordsToScreenCoords(
          firstPoint.x,
          firstPoint.y
        );
        const screenExtraPoint = sceneCoordsToScreenCoords(
          extraPoint.x,
          extraPoint.y
        );
        if (screenFirstPoint.distanceTo(screenExtraPoint) < SNAP_THRESHOLD) {
          extraPoint = firstPoint;
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
