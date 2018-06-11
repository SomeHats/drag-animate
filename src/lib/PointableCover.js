// @flow
import invariant from 'invariant';

const getFullscreenElement = () => {
  return (
    // $FlowFixMe - flow doesn't know about these properties on document
    document.fullscreenElement ||
    // $FlowFixMe - flow doesn't know about these properties on document
    document.webkitFullscreenElement ||
    // $FlowFixMe - flow doesn't know about these properties on document
    document.mozFullScreenElement ||
    // $FlowFixMe - flow doesn't know about these properties on document
    document.msFullscreenElement
  );
};

const coverStyle = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '100%',
  height: '100%',
  zIndex: '10000',
  touchAction: 'none',
};

type HandlerFn = MouseEvent => void;

type Options = {
  down: HandlerFn,
  move: HandlerFn,
  up: HandlerFn,
};

export default class PointableCover {
  onDown: ?HandlerFn = null;
  onMove: ?HandlerFn = null;
  onUp: ?HandlerFn = null;
  attachedTo: ?HTMLElement = null;
  cover: HTMLElement;

  constructor({ down, move, up }: $Shape<Options> = {}) {
    this.onDown = down;
    this.onMove = move;
    this.onUp = up;

    const cover = document.createElement('div');
    Object.assign(cover.style, coverStyle);
    cover.setAttribute('touch-action', 'none');

    this.cover = cover;
  }

  attach() {
    if (!this.attachedTo) {
      const target = getFullscreenElement() || document.body;
      invariant(target != null, 'target must exist');
      target.appendChild(this.cover);
      this.attachedTo = target;
      this.attachEvents();
    }
  }

  remove() {
    const attachedTo = this.attachedTo;
    if (attachedTo) {
      this.attachedTo = null;
      this.removeEvents();
      attachedTo.removeChild(this.cover);
    }
  }

  attachEvents() {
    if (this.onDown) {
      // $FlowFixMe - flow doesn't know about pointer events
      this.cover.addEventListener('pointerdown', this.onDown, false);
    }

    if (this.onMove) {
      // $FlowFixMe - flow doesn't know about pointer events
      this.cover.addEventListener('pointermove', this.onMove, false);
    }

    if (this.onUp) {
      // $FlowFixMe - flow doesn't know about pointer events
      this.cover.addEventListener('pointerup', this.onUp, false);
    }
  }

  removeEvents() {
    if (this.onDown) {
      // $FlowFixMe - flow doesn't know about pointer events
      this.cover.removeEventListener('pointerdown', this.onDown);
    }

    if (this.onMove) {
      // $FlowFixMe - flow doesn't know about pointer events
      this.cover.removeEventListener('pointermove', this.onMove);
    }

    if (this.onUp) {
      // $FlowFixMe - flow doesn't know about pointer events
      this.cover.removeEventListener('pointerup', this.onUp);
    }
  }
}
