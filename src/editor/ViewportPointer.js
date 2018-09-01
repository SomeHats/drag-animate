// @flow
import EventEmitter from 'events';
import { decorate, observable, computed, action } from 'mobx';
import Vector2 from '../lib/Vector2';
import type Viewport from './Viewport';
import type { SelectionItem } from './SelectionItem';

class ViewportPointer extends EventEmitter {
  viewport: Viewport;
  screenPosition: null | Vector2 = null;
  isDown: boolean = false;
  cursor: string = 'default';

  constructor(viewport: Viewport) {
    super();
    this.viewport = viewport;
  }

  get isActive(): boolean {
    return this.screenPosition !== null;
  }

  get scenePosition(): Vector2 | null {
    const { screenPosition } = this;
    if (screenPosition) {
      return this.viewport.screenCoordsToSceneCoords(
        screenPosition.x,
        screenPosition.y,
      );
    }
    return null;
  }

  setPosition(screenX: number, screenY: number) {
    if (this.screenPosition) {
      this.screenPosition.setXY(screenX, screenY);
    } else {
      this.screenPosition = new Vector2(screenX, screenY);
    }
  }

  clearPosition() {
    this.screenPosition = null;
  }

  triggerPointerDown() {
    this.isDown = true;
    this.emit('pointerDown');
  }

  triggerPointerMove() {
    this.emit('pointerMove');
  }

  triggerPointerUp() {
    this.isDown = false;
    this.emit('pointerUp');
  }

  onPointerDown(cb: Viewport => void): () => void {
    const handler = () => cb(this.viewport);
    this.addListener('pointerDown', handler);
    return () => {
      this.removeListener('pointerDown', handler);
    };
  }

  onPointerMove(cb: Viewport => void): () => void {
    const handler = () => cb(this.viewport);
    this.addListener('pointerMove', handler);
    return () => {
      this.removeListener('pointerMove', handler);
    };
  }

  onPointerUp(cb: Viewport => void): () => void {
    const handler = () => cb(this.viewport);
    this.addListener('pointerUp', handler);
    return () => {
      this.removeListener('pointerUp', handler);
    };
  }

  get hoveredItem(): SelectionItem | null {
    if (!this.scenePosition) return null;
    return this.viewport.getItemAtSceneCoord(this.scenePosition);
  }
}

export default decorate(ViewportPointer, {
  isDown: observable,
  screenPosition: observable,
  cursor: observable,
  scenePosition: computed,
  isActive: computed,
  hoveredItem: computed,
  setPosition: action,
  triggerPointerDown: action,
  triggerPointerMove: action,
  triggerPointerUp: action,
});
