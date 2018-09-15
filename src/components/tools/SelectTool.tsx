// @flow
import React from 'react';
import cyan from '@material-ui/core/colors/cyan';
import purple from '@material-ui/core/colors/purple';
import { spawnUnknownSwitchCaseError, assertExists } from '../../util';
import * as CanvasHelpers from '../../lib/CanvasHelpers';
import Shape from '../../document/shapes/Shape';
import ShapePoint from '../../document/shapes/ShapePoint';
import {
  SelectionItem,
  SelectionItemType,
  ShapeSelectionItem,
  MagicPointThingySelectionItem,
  ControlPointSelectionItem,
} from '../../editor/SelectionItem';
import ViewportCanvas, { Viewport } from '../viewport/ViewportCanvas';
import ViewportInteraction from '../viewport/ViewportInteraction';
import KeyPoints from '../guides/KeyPoints';

interface SelectToolProps {}

class SelectTool extends React.Component<SelectToolProps> {
  getHoveredItem({
    pointer,
    editor,
    nearestKeyPoint,
    px,
  }: Viewport): SelectionItem | null {
    const pointerPos = pointer.scenePosition;
    if (!pointerPos) return null;

    const selectThreshold = 8 * px;

    for (const selectedItem of editor.selection) {
      if (selectedItem.type === SelectionItemType.MagicPointThingy) {
        const leadingControlPoint =
          selectedItem.point.leadingControlPointGlobal;
        if (
          leadingControlPoint &&
          leadingControlPoint
            .getAtKeyPoint(nearestKeyPoint)
            .distanceTo(pointerPos) < selectThreshold
        ) {
          return {
            type: SelectionItemType.ControlPoint,
            point: selectedItem.point,
            inShape: selectedItem.inShape,
            controlPoint: 'leading',
          };
        }
        const followingControlPoint =
          selectedItem.point.followingControlPointGlobal;
        if (
          followingControlPoint &&
          followingControlPoint
            .getAtKeyPoint(nearestKeyPoint)
            .distanceTo(pointerPos) < selectThreshold
        ) {
          return {
            type: SelectionItemType.ControlPoint,
            point: selectedItem.point,
            inShape: selectedItem.inShape,
            controlPoint: 'following',
          };
        }
      }
    }

    return pointer.hoveredItem;
  }

  drawHover = (ctx: CanvasRenderingContext2D, viewport: Viewport) => {
    const hoveredItem = this.getHoveredItem(viewport);
    if (hoveredItem) {
      this.drawSelectionItem(ctx, hoveredItem, cyan.A400, viewport);
    }
  };

  drawSelection = (ctx: CanvasRenderingContext2D, viewport: Viewport) => {
    viewport.editor.selection.forEach(selectedItem => {
      this.drawSelectionItem(ctx, selectedItem, purple.A400, viewport);
    });
  };

  drawSelectionItem(
    ctx: CanvasRenderingContext2D,
    selectionItem: SelectionItem,
    color: string,
    viewport: Viewport,
  ) {
    switch (selectionItem.type) {
      case SelectionItemType.Shape:
        return this.drawShapeSelectionGuide(
          ctx,
          selectionItem.shape,
          color,
          viewport,
        );
      case SelectionItemType.MagicPointThingy:
        return this.drawPointSelectionGuide(
          ctx,
          selectionItem.inShape,
          selectionItem.point,
          color,
          viewport,
          {
            fillOrigin: true,
            fillLeadingControl: false,
            fillFollowingControl: false,
          },
        );
      case SelectionItemType.ControlPoint:
        return this.drawPointSelectionGuide(
          ctx,
          selectionItem.inShape,
          selectionItem.point,
          color,
          viewport,
          {
            fillOrigin: false,
            fillLeadingControl: selectionItem.controlPoint === 'leading',
            fillFollowingControl: selectionItem.controlPoint === 'following',
          },
        );
      default:
        throw spawnUnknownSwitchCaseError('SelectionItemType', selectionItem);
    }
  }

  drawShapeSelectionGuide(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    color: string,
    viewport: Viewport,
  ) {
    this.drawShapeOutline(ctx, shape, color, viewport);
    this.drawPointOutlines(ctx, shape, color, viewport);
  }

  drawPointSelectionGuide(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    point: ShapePoint,
    color: string,
    viewport: Viewport,
    opts: {
      fillOrigin: boolean;
      fillLeadingControl: boolean;
      fillFollowingControl: boolean;
    },
  ) {
    this.drawShapeSelectionGuide(ctx, shape, color, viewport);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    const { px, basePoint } = viewport;
    CanvasHelpers.drawShapePointWithControlPoints(
      ctx,
      point,
      basePoint,
      5 * px,
      opts,
    );
  }

  drawShapeOutline(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    color: string,
    { px, basePoint }: Viewport,
  ) {
    ctx.lineWidth = px;
    ctx.strokeStyle = color;
    ctx.stroke(shape.getCanvasPathAtBasePoint(basePoint));
  }

  drawPointOutlines(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    color: string,
    { px, basePoint }: Viewport,
  ) {
    ctx.lineWidth = px;
    ctx.strokeStyle = color;
    shape.points.forEach(point => {
      CanvasHelpers.drawSquarePoint(
        ctx,
        point.originPoint.getAtBasePoint(basePoint),
        5 * px,
      );
    });
  }

  handleClick = (viewport: Viewport) => {
    const { keyboard, editor } = viewport;
    const selectionItem = this.getHoveredItem(viewport);
    if (selectionItem) {
      if (keyboard.isPressed('shift') || keyboard.isPressed('ctrl')) {
        editor.toggleSelected(selectionItem);
      } else {
        editor.replaceSelection([selectionItem]);
      }
    } else {
      editor.clearSelection();
    }
  };

  handleDragAsync = async (
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
  ): Promise<void> => {
    const selection = this.getHoveredItem(viewport);
    if (!selection) return;

    switch (selection.type) {
      case SelectionItemType.MagicPointThingy:
        return await this.handleMagicPointThingyDrag(
          selection,
          viewport,
          isClick,
          hasNextDragPosition,
        );
      case SelectionItemType.Shape:
        return await this.handleShapeDrag(
          selection,
          viewport,
          isClick,
          hasNextDragPosition,
        );
      case SelectionItemType.ControlPoint:
        return await this.handleControlPointDrag(
          selection,
          viewport,
          isClick,
          hasNextDragPosition,
        );
      default:
        throw spawnUnknownSwitchCaseError('SelectionItemType', selection);
    }
  };

  async handleMagicPointThingyDrag(
    selection: MagicPointThingySelectionItem,
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
  ): Promise<void> {
    if (await isClick) return;

    while (await hasNextDragPosition()) {
      const scenePosition = viewport.pointer.scenePosition;
      if (scenePosition) {
        selection.point.originPoint.setAtKeyPoint(
          viewport.nearestKeyPoint,
          scenePosition,
        );
      }
    }
  }

  async handleShapeDrag(
    selection: ShapeSelectionItem,
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
  ): Promise<void> {
    let lastPosition = assertExists(viewport.pointer.scenePosition);

    if (await isClick) return;

    while (await hasNextDragPosition()) {
      const newPosition = assertExists(viewport.pointer.scenePosition);

      const offset = newPosition.subtract(lastPosition);
      selection.shape.points.forEach(point => {
        point.originPoint.setAtKeyPoint(
          viewport.nearestKeyPoint,
          point.originPoint.getAtKeyPoint(viewport.nearestKeyPoint).add(offset),
        );
      });

      lastPosition = newPosition;
    }
  }

  async handleControlPointDrag(
    selection: ControlPointSelectionItem,
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
  ): Promise<void> {
    if (await isClick) return;

    while (await hasNextDragPosition()) {
      const scenePosition = viewport.pointer.scenePosition;
      if (scenePosition) {
        if (selection.controlPoint === 'leading') {
          const controlPoint = assertExists(
            selection.point.leadingControlPointGlobal,
          );
          controlPoint.setAtKeyPoint(viewport.nearestKeyPoint, scenePosition);
          selection.point.leadingControlPointGlobal = controlPoint;
        } else {
          const controlPoint = assertExists(
            selection.point.followingControlPointGlobal,
          );
          controlPoint.setAtKeyPoint(viewport.nearestKeyPoint, scenePosition);
          selection.point.followingControlPointGlobal = controlPoint;
        }
      }
    }
  }

  render() {
    return (
      <>
        <KeyPoints />
        <ViewportCanvas draw={this.drawHover} />
        <ViewportCanvas draw={this.drawSelection} />
        <ViewportInteraction
          onClick={this.handleClick}
          onDragAsync={this.handleDragAsync}
        />
      </>
    );
  }
}

export default SelectTool;
