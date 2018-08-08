// @flow
import React from 'react';
import invariant from 'invariant';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import purple from '@material-ui/core/colors/purple';
import Shape from '../../document/shapes/Shape';
import ShapePoint from '../../document/shapes/ShapePoint';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import ViewportCanvas from '../viewport/ViewportCanvas';
import ViewportInteraction from '../viewport/ViewportInteraction';
import * as CanvasHelpers from '../../lib/CanvasHelpers';

type Props = {|
  viewport: Viewport,
|};

type State = {|
  targetShape: Shape | null,
|};

class PenTool extends React.Component<Props> {
  liveState: State = observable({
    targetShape: null,
  });

  draw = (ctx: CanvasRenderingContext2D, { nearestKeyPoint, px }: Viewport) => {
    const { shapePoints, isClosed } = this.getTargetScenePoints();

    ctx.lineWidth = px;
    ctx.strokeStyle = purple.A400;
    ctx.stroke(
      CanvasHelpers.getShapePath(shapePoints, nearestKeyPoint, isClosed)
    );

    shapePoints.forEach(point => {
      CanvasHelpers.drawSquarePointOutline(
        ctx,
        point.originPoint.getAtBasePoint(nearestKeyPoint),
        5 * px
      );
    });
  };

  shouldSnapClosed(): boolean {
    const {
      nearestKeyPoint,
      pointer,
      sceneCoordsToScreenCoords,
    } = this.props.viewport;
    const screenPosition = pointer.screenPosition;
    if (!screenPosition) return false;

    const existingPoints =
      this.liveState.targetShape && this.liveState.targetShape.points;
    if (!existingPoints || existingPoints.length < 2) return false;

    const firstPointOrigin = existingPoints[0].originPoint.getAtKeyPoint(
      nearestKeyPoint
    );
    const firstPointOriginScreenCoords = sceneCoordsToScreenCoords(
      firstPointOrigin.x,
      firstPointOrigin.y
    );
    const screenDistanceFromFirstPointOrigin = firstPointOriginScreenCoords.distanceTo(
      screenPosition
    );

    return screenDistanceFromFirstPointOrigin < 7;
  }

  getTargetScenePoints(): { shapePoints: ShapePoint[], isClosed: boolean } {
    const {
      pointer,
      editor,
      nearestKeyPoint,
    } = this.props.viewport;
    const { targetShape } = this.liveState;

    const scenePosition = pointer.scenePosition;
    const existingPoints = targetShape ? targetShape.points : [];

    // if there's no scenePosition, the viewport isn't active
    if (scenePosition) {
      if (this.shouldSnapClosed()) {
        return { shapePoints: existingPoints, isClosed: true };
      }

      const magicPointThingy = editor.scene.createMagicPointThingy();
      magicPointThingy.setAtKeyPoint(nearestKeyPoint, scenePosition);
      return {
        shapePoints: [
          ...existingPoints,
          new ShapePoint().init(magicPointThingy),
        ],
        isClosed: false,
      };
    }

    return { shapePoints: existingPoints, isClosed: false };
  }

  getOrCreateTargetShape(): Shape {
    if (this.liveState.targetShape) {
      return this.liveState.targetShape;
    }

    const shape = new Shape();
    this.props.viewport.editor.scene.addShape(shape);
    this.liveState.targetShape = shape;

    return shape;
  }

  handleDrag = async (
    { pointer, editor, nearestKeyPoint }: Viewport,
    isClick: Promise<boolean>
  ): Promise<void> => {
    const startPosition = pointer.scenePosition;
    invariant(startPosition, 'pointer must be active');

    const shape = this.getOrCreateTargetShape();
    const isClosed = this.shouldSnapClosed();
    let shapePoint;
    if (isClosed) {
      shapePoint = shape.points[0];
      shape.close();
    } else {
      const originPoint = editor.scene.createMagicPointThingy();
      originPoint.setAtKeyPoint(nearestKeyPoint, startPosition);
      shapePoint = new ShapePoint().init(originPoint);
      shape.addPoint(shapePoint);
    }

    if (await isClick) {
    }

    if (isClosed) {
      this.liveState.targetShape = null;
    }
  };

  render() {
    return (
      <>
        <ViewportCanvas draw={this.draw} />
        <ViewportInteraction onDragAsync={this.handleDrag} />
      </>
    );
  }
}

export default withViewport(observer(PenTool));
