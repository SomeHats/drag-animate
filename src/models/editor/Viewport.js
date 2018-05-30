// @flow
import { decorate, observable, computed, action } from 'mobx';
import type Editor from './Editor';
import Vector2 from '../Vector2';

const MARGIN = 15;
type Point = { x: number, y: number };

class Viewport {
  top = 64;
  left = 0;
  bottom = 0;
  right = 300;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  scale = window.devicePixelRatio || 1;
  editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  get sceneWidth(): number {
    return this.editor.scene.width;
  }

  get sceneHeight(): number {
    return this.editor.scene.height;
  }

  get pxWidth(): number {
    return this.windowWidth - this.left - this.right;
  }

  get pxHeight(): number {
    return this.windowHeight - this.top - this.bottom;
  }

  get zoom(): number {
    const availWidth = this.pxWidth - 2 * MARGIN;
    const availHeight = this.pxHeight - 2 * MARGIN;
    const zoom = Math.min(
      availWidth / this.sceneWidth,
      availHeight / this.sceneHeight
    );
    return zoom;
  }

  get panX(): number {
    const availWidth = this.pxWidth - 2 * MARGIN;
    return this.zoom * this.sceneWidth < availWidth
      ? MARGIN + (availWidth / 2 - this.zoom * this.sceneWidth / 2)
      : MARGIN;
  }

  get panY(): number {
    const availHeight = this.pxHeight - 2 * MARGIN;
    return this.zoom * this.sceneHeight < availHeight
      ? MARGIN + (availHeight / 2 - this.zoom * this.sceneHeight / 2)
      : MARGIN;
  }

  get px(): number {
    return 1 / this.zoom;
  }

  sceneCoordsToScreenCoords({ x, y }: Point): Vector2 {
    return new Vector2(
      x * this.zoom + this.panX + this.left,
      y * this.zoom + this.panY + this.top
    );
  }

  screenCoordsToSceneCoords({ x, y }: Point): Vector2 {
    return new Vector2(
      (x - this.left - this.panX) / this.zoom,
      (y - this.top - this.panY) / this.zoom
    );
  }

  setup() {
    window.addEventListener('resize', this.onResize);
  }

  teardown() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = action(() => {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.scale = window.devicePixelRatio || 1;
  });
}

export default decorate(Viewport, {
  windowWidth: observable,
  windowHeight: observable,
  scale: observable,
  editor: observable,
  sceneWidth: computed,
  sceneHeight: computed,
  pxWidth: computed,
  pxHeight: computed,
  zoom: computed,
  panX: computed,
  panY: computed,
  px: computed,
});
