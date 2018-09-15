// @flow
import EventEmitter from 'events';
import { observable, computed, action } from 'mobx';
import Vector2 from '../lib/Vector2';
import Viewport from './Viewport';
import { SelectionItem } from './SelectionItem';

class ViewportPointer extends EventEmitter {
  @observable
  viewport: Viewport;
  @observable
  screenPosition: null | Vector2 = null;
  @observable
  isDown: boolean = false;
  @observable
  cursor: string = 'default';

  constructor(viewport: Viewport) {
    super();
    this.viewport = viewport;
  }

  @computed
  get isActive(): boolean {
    return this.screenPosition !== null;
  }

  @computed
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

  @action
  setPosition(screenX: number, screenY: number) {
    if (this.screenPosition) {
      this.screenPosition.setXY(screenX, screenY);
    } else {
      this.screenPosition = new Vector2(screenX, screenY);
    }
  }

  @action
  clearPosition() {
    this.screenPosition = null;
  }

  @action
  triggerPointerDown() {
    this.isDown = true;
    this.emit('pointerDown');
  }

  @action
  triggerPointerMove() {
    this.emit('pointerMove');
  }

  @action
  triggerPointerUp() {
    this.isDown = false;
    this.emit('pointerUp');
  }

  onPointerDown(cb: (viewport: Viewport) => void): () => void {
    const handler = () => cb(this.viewport);
    this.addListener('pointerDown', handler);
    return () => {
      this.removeListener('pointerDown', handler);
    };
  }

  onPointerMove(cb: (viewport: Viewport) => void): () => void {
    const handler = () => cb(this.viewport);
    this.addListener('pointerMove', handler);
    return () => {
      this.removeListener('pointerMove', handler);
    };
  }

  onPointerUp(cb: (viewport: Viewport) => void): () => void {
    const handler = () => cb(this.viewport);
    this.addListener('pointerUp', handler);
    return () => {
      this.removeListener('pointerUp', handler);
    };
  }

  @computed
  get hoveredItem(): SelectionItem | null {
    if (!this.scenePosition) return null;
    return this.viewport.getItemAtSceneCoord(this.scenePosition);
  }
}

export default ViewportPointer;
