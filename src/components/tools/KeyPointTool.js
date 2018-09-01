// @flow
import React from 'react';
import { decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import purple from '@material-ui/core/colors/purple';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import ViewportCanvas from '../viewport/ViewportCanvas';
import ViewportInteraction from '../viewport/ViewportInteraction';
import { keyPointPath } from '../../lib/CanvasHelpers';
import KeyPoints from '../guides/KeyPoints';

type Props = {|
  viewport: Viewport,
|};

class KeyPointTool extends React.Component<Props> {
  cursor: string = 'default';

  getHoveredKeyPoint() {
    const { pointer, editor, px } = this.props.viewport;

    const pointerPosition = pointer.scenePosition;
    if (pointerPosition === null) return;

    const nearestKeyPoint = editor.scene.keyPointSet.getNearestTo(
      pointerPosition,
    );

    if (nearestKeyPoint.distanceTo(pointerPosition) < 10 * px) {
      return nearestKeyPoint;
    } else {
      return null;
    }
  }

  draw = (
    ctx: CanvasRenderingContext2D,
    { editor, pointer, px, sceneCoordsToScreenCoords }: Viewport,
  ) => {
    this.cursor = 'default';
    const hoveredKeyPoint = this.getHoveredKeyPoint();
    if (hoveredKeyPoint) {
      // hovering an existing key point
      this.cursor = 'move';
    } else {
      // not hovering an existing key point, so we can maybe create one:
      const pointerPosition = pointer.scenePosition;
      if (pointerPosition === null) return;

      keyPointPath(ctx, pointerPosition, false, px);
      ctx.lineWidth = px;
      ctx.strokeStyle = purple.A400;
      ctx.stroke();
      this.cursor = 'none';
    }
  };

  handleDrag = async (
    { pointer, editor, basePoint }: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
  ): Promise<void> => {
    const hoveredKeyPoint = this.getHoveredKeyPoint();

    if (hoveredKeyPoint) {
      // if we're hovering over a keypoint, we want to drag it:
      if (await isClick) return;
      while (await hasNextDragPosition()) {
        const pointerPosition = pointer.scenePosition;
        if (pointerPosition) {
          hoveredKeyPoint.set(pointerPosition);
          basePoint.set(pointerPosition);
        }
      }
    } else {
      // if we're not hovering over a keypoint, we want to click to create a new one:
      const pointerPosition = pointer.scenePosition;
      if ((await isClick) && pointerPosition) {
        editor.scene.keyPointSet.addKeyPoint(pointerPosition);
        basePoint.set(pointerPosition);
      }
    }
  };

  render() {
    return (
      <>
        <KeyPoints showAll />
        <ViewportCanvas draw={this.draw} />
        <ViewportInteraction
          onDragAsync={this.handleDrag}
          cursor={this.cursor}
        />
      </>
    );
  }
}

export default withViewport(
  observer(decorate(KeyPointTool, { cursor: observable })),
);
