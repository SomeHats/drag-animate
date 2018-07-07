// @flow
import React from 'react';
import invariant from 'invariant';
import cyan from '@material-ui/core/colors/cyan';
import * as PointHelpers from '../../canvas/PointHelpers';
import type Shape from '../../models/document/shapes/Shape';
import type {
  SelectionItem,
  ShapeSelectionItem,
  MagicPointThingySelectionItem,
} from '../../models/editor/SelectionItem';
import ViewportCanvas, { type Viewport } from '../lib/ViewportCanvas';

class SelectTool extends React.Component<{}> {
  draw = (ctx: CanvasRenderingContext2D, viewport: Viewport) => {
    const hoveredItem = viewport.pointer.hoveredItem;
    if (hoveredItem) {
      this.drawSelectionItem(ctx, hoveredItem, cyan.A400, viewport);
    }
  };

  drawSelectionItem(
    ctx: CanvasRenderingContext2D,
    selectionItem: SelectionItem,
    color: string,
    viewport: Viewport
  ) {
    switch (selectionItem.type) {
      case 'ShapeSelectionItem':
        return this.drawShapeSelectionItem(ctx, selectionItem, color, viewport);
      case 'MagicPointThingySelectionItem':
        return this.drawMagicPointThingySelectionItem(
          ctx,
          selectionItem,
          color,
          viewport
        );
      default:
        throw new Error(
          `Unknown selection item type: ${(selectionItem.type: empty)}`
        );
    }
  }

  drawShapeSelectionItem(
    ctx: CanvasRenderingContext2D,
    { shape }: ShapeSelectionItem,
    color: string,
    viewport: Viewport
  ) {
    this.drawShapeOutline(ctx, shape, color, viewport);
    this.drawPointOutlines(ctx, shape, color, viewport);
  }

  drawMagicPointThingySelectionItem(
    ctx: CanvasRenderingContext2D,
    { point, inShape }: MagicPointThingySelectionItem,
    color: string,
    viewport: Viewport
  ) {
    this.drawShapeOutline(ctx, inShape, color, viewport);
    this.drawPointOutlines(ctx, inShape, color, viewport);

    ctx.beginPath();
    ctx.fillStyle = color;
    const { px, basePoint } = viewport;
    PointHelpers.square(ctx, point.getAtBasePoint(basePoint), 5 * px);
    ctx.fill();
  }

  drawShapeOutline(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    color: string,
    { px, basePoint }: Viewport
  ) {
    ctx.lineWidth = px;
    ctx.strokeStyle = color;
    ctx.stroke(shape.getCanvasPathAtBasePoint(basePoint));
  }

  drawPointOutlines(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    color: string,
    { px, basePoint }: Viewport
  ) {
    ctx.beginPath();
    shape.points.forEach(point => {
      PointHelpers.square(ctx, point.getAtBasePoint(basePoint), 5 * px);
    });
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
  }

  handleClick = (viewport: Viewport) => {
    const selection = viewport.pointer.hoveredItem;
    console.log(selection);
  };

  handleDragAsync = async (
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>
  ): Promise<void> => {
    const selection = viewport.pointer.hoveredItem;
    if (!selection) return;

    switch (selection.type) {
      case 'MagicPointThingySelectionItem':
        return await this.handleMagicPointThingyDrag(
          selection,
          viewport,
          isClick,
          hasNextDragPosition
        );
      case 'ShapeSelectionItem': {
        return await this.handleShapeDrag(
          selection,
          viewport,
          isClick,
          hasNextDragPosition
        );
      }
      default:
        throw new Error(`Unknown selection type: ${(selection.type: empty)}`);
    }
  };

  async handleMagicPointThingyDrag(
    selection: MagicPointThingySelectionItem,
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>
  ): Promise<void> {
    if (await isClick) return;
    while (await hasNextDragPosition()) {
      const scenePosition = viewport.pointer.scenePosition;
      if (scenePosition) {
        selection.point.setAtKeyPoint(viewport.nearestKeyPoint, scenePosition);
      }
    }
  }

  async handleShapeDrag(
    selection: ShapeSelectionItem,
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>
  ): Promise<void> {
    let lastPosition = viewport.pointer.scenePosition;
    invariant(lastPosition, 'viewport pointer must be active');
    while (await hasNextDragPosition()) {
      const newPosition = viewport.pointer.scenePosition;
      invariant(newPosition, 'viewport pointer must be active');

      const offset = newPosition.subtract(lastPosition);
      selection.shape.points.forEach(point => {
        point.setAtKeyPoint(
          viewport.nearestKeyPoint,
          point.getAtKeyPoint(viewport.nearestKeyPoint).add(offset)
        );
      });

      lastPosition = newPosition;
    }
  }

  render() {
    return (
      <ViewportCanvas
        draw={this.draw}
        onClick={this.handleClick}
        onDragAsync={this.handleDragAsync}
      />
    );
  }
}

export default SelectTool;
