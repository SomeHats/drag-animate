// @flow
import EventEmitter from 'events';
import { decorate, observable, computed, action } from 'mobx';
import invariant from 'invariant';
import type Scene from '../document/Scene';
import Vector2 from '../lib/Vector2';
import type Editor from './Editor';
import type { SelectionItem } from './SelectionItem';
import ViewportPointer from './ViewportPointer';
import keyboard from './keyboard';

const MARGIN = 15;

const testCanvas = document.createElement('canvas');
const testContext = testCanvas.getContext('2d');

class Viewport extends EventEmitter {
  keyboard = keyboard;
  top = 0;
  left = 0;
  bottom = 0;
  right = 0;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  scale = window.devicePixelRatio || 1;
  editor: Editor;
  basePoint: Vector2 = new Vector2(0, 0);
  pointer: ViewportPointer = new ViewportPointer(this);

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    this.basePoint.set(editor.scene.keyPointSet.keyPoints[0]);
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
      availHeight / this.sceneHeight,
    );
    return zoom;
  }

  get panX(): number {
    const availWidth = this.pxWidth - 2 * MARGIN;
    return this.zoom * this.sceneWidth < availWidth
      ? MARGIN + (availWidth / 2 - (this.zoom * this.sceneWidth) / 2)
      : MARGIN;
  }

  get panY(): number {
    const availHeight = this.pxHeight - 2 * MARGIN;
    return this.zoom * this.sceneHeight < availHeight
      ? MARGIN + (availHeight / 2 - (this.zoom * this.sceneHeight) / 2)
      : MARGIN;
  }

  get px(): number {
    return 1 / this.zoom;
  }

  get nearestKeyPoint(): Vector2 {
    const nearest = this.basePoint.findNearest(
      this.editor.scene.keyPointSet.keyPoints,
    );
    invariant(nearest, 'nearest must be found');
    return nearest;
  }

  get scene(): Scene {
    return this.editor.scene;
  }

  sceneCoordsToScreenCoords = (x: number, y: number): Vector2 => {
    return new Vector2(
      x * this.zoom + this.panX + this.left,
      y * this.zoom + this.panY + this.top,
    );
  };

  screenCoordsToSceneCoords = (x: number, y: number): Vector2 => {
    return new Vector2(
      (x - this.left - this.panX) / this.zoom,
      (y - this.top - this.panY) / this.zoom,
    );
  };

  setSize(
    windowWidth,
    windowHeight,
    devicePixelRatio,
    left,
    top,
    right,
    bottom,
  ) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.scale = devicePixelRatio;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }

  getItemAtSceneCoord(sceneCoord: Vector2): SelectionItem | null {
    const selectThreshold = 8 * this.px;
    testContext.lineWidth = selectThreshold;

    for (const shape of this.editor.scene.shapes) {
      for (const point of shape.points) {
        if (
          sceneCoord.distanceTo(
            point.originPoint.getAtBasePoint(this.basePoint),
          ) < selectThreshold
        ) {
          return {
            type: 'MagicPointThingySelectionItem',
            point: point,
            inShape: shape,
          };
        }
      }

      const path = shape.getCanvasPathAtBasePoint(this.basePoint);
      if (testContext.isPointInStroke(path, sceneCoord.x, sceneCoord.y)) {
        return {
          type: 'ShapeSelectionItem',
          shape: shape,
        };
      }
    }

    return null;
  }
}

export default decorate(Viewport, {
  windowWidth: observable,
  windowHeight: observable,
  scale: observable,
  top: observable,
  left: observable,
  bottom: observable,
  right: observable,
  editor: observable,
  pointer: observable,
  sceneWidth: computed,
  sceneHeight: computed,
  pxWidth: computed,
  pxHeight: computed,
  zoom: computed,
  panX: computed,
  panY: computed,
  px: computed,
  scene: computed,
  nearestKeyPoint: invariant,
  setSize: action,
});
