// @flow
import EventEmitter from 'events';
import { observable, computed, action } from 'mobx';
import { crash, assertExists } from '../util';
import Scene from '../document/Scene';
import Vector2 from '../lib/Vector2';
import Editor from './Editor';
import { SelectionItem, SelectionItemType } from './SelectionItem';
import ViewportPointer from './ViewportPointer';
import keyboard from './keyboard';

const MARGIN = 15;

const testCanvas = document.createElement('canvas');
const testContext = assertExists(testCanvas.getContext('2d'));

class Viewport extends EventEmitter {
  @observable
  keyboard = keyboard;
  @observable
  top = 0;
  @observable
  left = 0;
  @observable
  bottom = 0;
  @observable
  right = 0;
  @observable
  windowWidth = window.innerWidth;
  @observable
  windowHeight = window.innerHeight;
  @observable
  scale = window.devicePixelRatio || 1;
  @observable
  editor: Editor;
  @observable
  basePoint: Vector2 = new Vector2(0, 0);
  @observable
  pointer: ViewportPointer = new ViewportPointer(this);
  @observable
  panX = 0;
  @observable
  panY = 0;
  @observable
  zoom = 1;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    const { scene } = editor;
    const centerOfScene = new Vector2(scene.width / 2, scene.height / 2);
    const keyPointAtCenter = scene.keyPointSet.getNearestTo(centerOfScene);
    this.basePoint.set(keyPointAtCenter);
  }

  @computed
  get sceneWidth(): number {
    return this.editor.scene.width;
  }

  @computed
  get sceneHeight(): number {
    return this.editor.scene.height;
  }

  @computed
  get pxWidth(): number {
    return this.windowWidth - this.left - this.right;
  }

  @computed
  get pxHeight(): number {
    return this.windowHeight - this.top - this.bottom;
  }

  @computed
  get idealZoom(): number {
    const availWidth = this.pxWidth - 2 * MARGIN;
    const availHeight = this.pxHeight - 2 * MARGIN;
    const zoom = Math.min(
      availWidth / this.sceneWidth,
      availHeight / this.sceneHeight,
    );
    return zoom;
  }

  @computed
  get idealPanX(): number {
    const availWidth = this.pxWidth - 2 * MARGIN;
    return this.zoom * this.sceneWidth < availWidth
      ? MARGIN + (availWidth / 2 - (this.zoom * this.sceneWidth) / 2)
      : MARGIN;
  }

  @computed
  get idealPanY(): number {
    const availHeight = this.pxHeight - 2 * MARGIN;
    return this.zoom * this.sceneHeight < availHeight
      ? MARGIN + (availHeight / 2 - (this.zoom * this.sceneHeight) / 2)
      : MARGIN;
  }

  @computed
  get px(): number {
    return 1 / this.zoom;
  }

  @computed
  get nearestKeyPoint(): Vector2 {
    const nearest = this.basePoint.findNearest(
      this.editor.scene.keyPointSet.keyPoints,
    );
    if (!nearest) return crash('nearest must be found');
    return nearest;
  }

  @computed
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

  @action
  setSize(
    windowWidth: number,
    windowHeight: number,
    devicePixelRatio: number,
    left: number,
    top: number,
    right: number,
    bottom: number,
  ) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.scale = devicePixelRatio;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.panX = this.idealPanX;
    this.panY = this.idealPanY;
    this.zoom = this.idealZoom;
  }

  @action
  zoomAtPoint(zoomAdjust: number, screenX: number, screenY: number) {
    console.log(zoomAdjust);
    const currentZoom = this.zoom;
    const newZoom = currentZoom * zoomAdjust;
    const currentSceneCoords = this.screenCoordsToSceneCoords(screenX, screenY);

    this.panX =
      screenX -
      this.left -
      (newZoom / currentZoom) * (screenX - this.left - this.panX);
    this.panY =
      screenY -
      this.top -
      (newZoom / currentZoom) * (screenY - this.top - this.panY);

    this.zoom = newZoom;

    console.log({
      oldSceneCoords: currentSceneCoords.toString(),
      newSceneCoords: this.screenCoordsToSceneCoords(
        screenX,
        screenY,
      ).toString(),
    });
  }

  @action
  pan(x: number, y: number) {
    this.panX += x;
    this.panY += y;
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
            type: SelectionItemType.MagicPointThingy,
            point: point,
            inShape: shape,
          };
        }
      }

      const path = shape.getCanvasPathAtBasePoint(this.basePoint);
      if (testContext.isPointInStroke(path, sceneCoord.x, sceneCoord.y)) {
        return {
          type: SelectionItemType.Shape,
          shape: shape,
        };
      }
    }

    return null;
  }
}

export default Viewport;
