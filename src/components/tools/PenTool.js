// @flow
import React from 'react';
import invariant from 'invariant';
import { observable, decorate } from 'mobx';
import { observer } from 'mobx-react';
import purple from '@material-ui/core/colors/purple';
import Shape from '../../document/shapes/Shape';
import ShapePoint from '../../document/shapes/ShapePoint';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import ViewportCanvas from '../viewport/ViewportCanvas';
import ViewportInteraction from '../viewport/ViewportInteraction';
import * as CanvasHelpers from '../../lib/CanvasHelpers';
import KeyPoints from '../guides/KeyPoints';

type Props = {|
  viewport: Viewport,
|};

class PenTool extends React.Component<Props> {
  targetShape: Shape | null = null;
  isDragging: boolean = false;

  draw = (ctx: CanvasRenderingContext2D, { basePoint, px }: Viewport) => {
    const { shapePoints, isClosed } = this.getTargetScenePoints();

    ctx.lineWidth = px;
    ctx.strokeStyle = purple.A400;
    ctx.stroke(CanvasHelpers.getShapePath(shapePoints, basePoint, isClosed));

    shapePoints.forEach(point => {
      CanvasHelpers.drawShapePointWithControlPoints(
        ctx,
        point,
        basePoint,
        5 * px,
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

    const existingPoints = this.targetShape && this.targetShape.points;
    if (!existingPoints || existingPoints.length < 2) return false;

    const firstPointOrigin = existingPoints[0].originPoint.getAtKeyPoint(
      nearestKeyPoint,
    );
    const firstPointOriginScreenCoords = sceneCoordsToScreenCoords(
      firstPointOrigin.x,
      firstPointOrigin.y,
    );
    const screenDistanceFromFirstPointOrigin = firstPointOriginScreenCoords.distanceTo(
      screenPosition,
    );

    return screenDistanceFromFirstPointOrigin < 7;
  }

  getTargetScenePoints(): {
    shapePoints: ShapePoint[],
    isClosed: boolean,
    isLastPointGuide: boolean,
  } {
    const { pointer, editor, nearestKeyPoint } = this.props.viewport;
    const { targetShape, isDragging } = this;

    const scenePosition = pointer.scenePosition;
    const existingPoints = targetShape ? targetShape.points : [];

    // if there's no scenePosition, the viewport isn't active
    if (scenePosition) {
      if (isDragging) {
        return {
          shapePoints: existingPoints,
          isClosed: targetShape ? targetShape.isClosed : false,
          isLastPointGuide: false,
        };
      }

      if (this.shouldSnapClosed()) {
        return {
          shapePoints: existingPoints,
          isClosed: true,
          isLastPointGuide: false,
        };
      }

      const magicPointThingy = editor.scene.createMagicPointThingy();
      magicPointThingy.setAtKeyPoint(nearestKeyPoint, scenePosition);
      return {
        shapePoints: [
          ...existingPoints,
          new ShapePoint().init(magicPointThingy),
        ],
        isClosed: false,
        isLastPointGuide: true,
      };
    }

    return {
      shapePoints: existingPoints,
      isClosed: false,
      isLastPointGuide: false,
    };
  }

  getOrCreateTargetShape(): Shape {
    if (this.targetShape) {
      return this.targetShape;
    }

    const shape = new Shape();
    this.props.viewport.editor.scene.addShape(shape);
    this.targetShape = shape;

    return shape;
  }

  handleDrag = async (
    { pointer, editor, nearestKeyPoint }: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
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

    if (!(await isClick)) {
      this.isDragging = true;
      while (await hasNextDragPosition()) {
        const leadingControlPoint =
          shapePoint.leadingControlPointGlobal ||
          editor.scene.createMagicPointThingy();

        invariant(pointer.scenePosition, 'scenePosition must be set');
        leadingControlPoint.setAtKeyPoint(
          nearestKeyPoint,
          pointer.scenePosition,
        );

        shapePoint.leadingControlPointGlobal = leadingControlPoint;
      }
      this.isDragging = false;
    }

    if (isClosed) {
      this.targetShape = null;
    }
  };

  render() {
    return (
      <>
        <KeyPoints />
        <ViewportCanvas draw={this.draw} />
        <ViewportInteraction onDragAsync={this.handleDrag} />
      </>
    );
  }
}

export default withViewport(
  observer(
    decorate(PenTool, { targetShape: observable, isDragging: observable }),
  ),
);
