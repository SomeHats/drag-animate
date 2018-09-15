// @flow
import { assertExists } from '../util';

const getFullscreenElement = (): HTMLElement | null => {
  const doc: any = document;
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
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

type HandlerFn = (event: MouseEvent) => void;

interface PointableCoverOptions {
  down?: HandlerFn;
  move?: HandlerFn;
  up?: HandlerFn;
}

export default class PointableCover {
  onDown: HandlerFn | null = null;
  onMove: HandlerFn | null = null;
  onUp: HandlerFn | null = null;
  attachedTo: HTMLElement | null = null;
  cover: HTMLElement;

  constructor({ down, move, up }: PointableCoverOptions = {}) {
    this.onDown = down || null;
    this.onMove = move || null;
    this.onUp = up || null;

    const cover = document.createElement('div');
    Object.assign(cover.style, coverStyle);
    cover.setAttribute('touch-action', 'none');

    this.cover = cover;
  }

  attach() {
    if (!this.attachedTo) {
      const target = assertExists(getFullscreenElement() || document.body);
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
      this.cover.addEventListener('pointerdown', this.onDown, false);
    }

    if (this.onMove) {
      this.cover.addEventListener('pointermove', this.onMove, false);
    }

    if (this.onUp) {
      this.cover.addEventListener('pointerup', this.onUp, false);
    }
  }

  removeEvents() {
    if (this.onDown) {
      this.cover.removeEventListener('pointerdown', this.onDown);
    }

    if (this.onMove) {
      this.cover.removeEventListener('pointermove', this.onMove);
    }

    if (this.onUp) {
      this.cover.removeEventListener('pointerup', this.onUp);
    }
  }
}
