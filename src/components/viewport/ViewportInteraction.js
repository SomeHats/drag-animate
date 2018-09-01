// @flow
import * as React from 'react';
import invariant from 'invariant';
import type Vector2 from '../../lib/Vector2';
import withExactProps from '../../lib/withExactProps';
import { withViewport, type Viewport } from './ViewportProvider';

export type { Viewport } from './ViewportProvider';

const DRAG_SCREEN_THRESHOLD_PX = 5;
const DRAG_TIME_THRESHOLD_MS = 150;

type Props = {
  onClick?: Viewport => mixed,
  onPointerDown?: Viewport => mixed,
  onPointerMove?: Viewport => mixed,
  onPointerUp?: Viewport => mixed,
  onDragStart?: Viewport => mixed,
  onDragMove?: Viewport => mixed,
  onDragEnd?: Viewport => mixed,
  onDragAsync?: (
    viewport: Viewport,
    isClick: Promise<boolean>,
    hasNextDragPosition: () => Promise<boolean>,
  ) => Promise<mixed>,
  cursor?: string,
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

class ViewportInteraction extends React.Component<Props> {
  _unsubscribes: Array<() => void> = [];
  _drag: DragData | null = null;

  componentDidMount() {
    const pointer = this.props.viewport.pointer;
    this._unsubscribes.push(pointer.onPointerDown(this.handlePointerDown));
    this._unsubscribes.push(pointer.onPointerMove(this.handlePointerMove));
    this._unsubscribes.push(pointer.onPointerUp(this.handlePointerUp));
  }

  componentDidUpdate(prevProps: Props) {
    const cursor = this.props.cursor;
    if (
      prevProps.cursor !== cursor &&
      cursor !== this.props.viewport.pointer.cursor
    ) {
      this.props.viewport.pointer.cursor = cursor == null ? 'default' : cursor;
    }
  }
  componentWillUnmount() {
    this._unsubscribes.forEach(unsubscribe => unsubscribe());
    this._unsubscribes = [];
  }

  handlePointerDown = () => {
    const startPosition = this.props.viewport.pointer.scenePosition;
    invariant(startPosition, 'viewport must have position to be pressed');
    this._drag = {
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

    const drag = this._drag;
    if (drag) {
      if (!drag.hasNotifiedStart) {
        const startScreenPosition = viewport.sceneCoordsToScreenCoords(
          drag.startScenePosition.x,
          drag.startScenePosition.y,
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
    const drag = this._drag;
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

  render() {
    return null;
  }
}

export default withExactProps(withViewport(ViewportInteraction));
