// @flow
import * as React from 'react';
import invariant from 'invariant';
import { observer } from 'mobx-react';
import type Vector2 from '../../models/Vector2';
import { ViewportConsumer, type Viewport } from './ViewportProvider';
import Canvas from './Canvas';

export type { Viewport } from './ViewportProvider';

type ViewportMouseEvent = Viewport => mixed;

const DRAG_SCREEN_THRESHOLD_PX = 5;
const DRAG_TIME_THRESHOLD_MS = 150;

type RequiredProps = {
  draw: (CanvasRenderingContext2D, Viewport) => void,
  cursor?: string,
  canvasRef?: (HTMLCanvasElement | null) => void,
  contextRef?: (CanvasRenderingContext2D | null) => void,
  onPointerDown?: ViewportMouseEvent,
  onPointerUp?: ViewportMouseEvent,
  onPointerMove?: ViewportMouseEvent,
  onDragStart?: ViewportMouseEvent,
  onDragMove?: ViewportMouseEvent,
  onDragEnd?: ViewportMouseEvent,
  onDragAsync?: (
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>
  ) => Promise<void>,
  onClick?: ViewportMouseEvent,
};

type Props = RequiredProps & {
  viewport: Viewport,
};

type AsyncDragData = {|
  notifyStart: () => void,
  notifyMove: () => void,
  notifyEnd: () => void,
|};

type DragData = {|
  startTime: number,
  startScenePosition: Vector2,
  hasNotifiedStart: boolean,
  asyncDrag: null | AsyncDragData,
|};

class _ViewportCanvas extends React.Component<Props, void> {
  unsubscribes: Array<() => void> = [];
  drag: DragData | null = null;

  componentDidMount() {
    const pointer = this.props.viewport.pointer;
    this.unsubscribes.push(pointer.onPointerDown(this.handlePointerDown));
    this.unsubscribes.push(pointer.onPointerMove(this.handlePointerMove));
    this.unsubscribes.push(pointer.onPointerUp(this.handlePointerUp));
  }

  componentWillUnmount() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.unsubscribes = [];
  }

  handlePointerDown = () => {
    const startPosition = this.props.viewport.pointer.scenePosition;
    invariant(startPosition, 'viewport must have position to be pressed');
    this.drag = {
      startTime: Date.now(),
      startScenePosition: startPosition.clone(),
      hasNotifiedStart: false,
      asyncDrag: this.startAsyncDrag(),
    };

    if (this.props.onPointerDown) this.props.onPointerDown(this.props.viewport);
  };

  handlePointerMove = () => {
    const viewport = this.props.viewport;
    const screenPosition = viewport.pointer.screenPosition;
    invariant(screenPosition, 'viewport must have position for pointermove');

    const drag = this.drag;
    if (drag) {
      if (!drag.hasNotifiedStart) {
        const startScreenPosition = viewport.sceneCoordsToScreenCoords(
          drag.startScenePosition.x,
          drag.startScenePosition.y
        );

        const isDrag =
          // has the press been held down for quite a while?
          drag.startTime + DRAG_TIME_THRESHOLD_MS > Date.now() ||
          // or has it moved a significant distance from the start?
          screenPosition.distanceTo(startScreenPosition) >
            DRAG_SCREEN_THRESHOLD_PX;

        if (isDrag) {
          if (this.props.onDragStart) this.props.onDragStart(viewport);
          drag.hasNotifiedStart = true;
          if (drag.asyncDrag) drag.asyncDrag.notifyStart();
        }
      }

      if (drag.hasNotifiedStart) {
        if (this.props.onDragMove) this.props.onDragMove(this.props.viewport);
        if (drag.asyncDrag) drag.asyncDrag.notifyMove();
      }
    }

    if (this.props.onPointerMove) this.props.onPointerMove(this.props.viewport);
  };

  handlePointerUp = () => {
    const drag = this.drag;
    invariant(drag, 'drag must be defined');

    if (drag.hasNotifiedStart) {
      if (this.props.onDragEnd) this.props.onDragEnd(this.props.viewport);
    } else {
      if (this.props.onClick) this.props.onClick(this.props.viewport);
    }

    if (this.props.onPointerUp) this.props.onPointerUp(this.props.viewport);
    if (drag.asyncDrag) drag.asyncDrag.notifyEnd();
  };

  startAsyncDrag() {
    const { viewport, onDragAsync } = this.props;
    if (!onDragAsync) return null;

    let resolveIsClick = (result: boolean) => {};
    const isClick = new Promise(resolve => {
      resolveIsClick = resolve;
    });

    let resolveNextPosition = (result: boolean) => {};
    const hasNextDragPosition = () =>
      new Promise(resolve => {
        resolveNextPosition = resolve;
      });

    onDragAsync(viewport, isClick, hasNextDragPosition);

    return {
      notifyStart: () => {
        resolveIsClick(false);
      },
      notifyMove: () => {
        resolveNextPosition(true);
      },
      notifyEnd: () => {
        resolveIsClick(true);
        resolveNextPosition(false);
      },
    };
  }

  windowCoordsToSceneCoords(x: number, y: number) {
    const { panX, panY, zoom } = this.props.viewport;
    return {
      x: (x - panX) / zoom,
      y: (y - 64 - panY) / zoom,
    };
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, draw } = this.props;
    const { panX, panY, zoom } = viewport;

    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    draw(ctx, viewport);
  };

  render() {
    const { viewport, cursor, canvasRef, contextRef } = this.props;
    const { pxWidth, pxHeight, left, top } = viewport;
    return (
      <Canvas
        style={{
          position: 'absolute',
          left,
          top,
          cursor: cursor == null ? undefined : cursor,
        }}
        draw={this.draw}
        width={pxWidth}
        height={pxHeight}
        canvasRef={canvasRef}
        contextRef={contextRef}
      />
    );
  }
}

const ViewportCanvas = observer(_ViewportCanvas);

export default (props: $Exact<RequiredProps>) => (
  <ViewportConsumer>
    {viewport => {
      invariant(viewport, 'viewport must be present');
      return <ViewportCanvas {...props} viewport={viewport} />;
    }}
  </ViewportConsumer>
);
