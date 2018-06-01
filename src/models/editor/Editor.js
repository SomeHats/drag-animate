// @flow
import { decorate, observable, action, autorun } from 'mobx';
// import { autorunAsync } from 'mobx-utils';
import invariant from 'invariant';
import type { EditorState } from './EditorState';
import Scene from '../document/Scene';
import Shape from '../document/shapes/Shape';
import PolygonShape from '../document/shapes/PolygonShape';

const AUTOSAVE_NAME = 'drag-animate.autosave';

class Editor {
  state: EditorState = { type: 'Idle' };
  scene: Scene;
  // TODO: make this not an array
  hoveredShapes: Shape[] = [];

  static fromAutoSave(fallback: () => Scene) {
    try {
      const saved = localStorage.getItem(AUTOSAVE_NAME);
      invariant(saved != null, 'no autosave present');
      const object = JSON.parse(saved);
      const scene = Scene.deserialize(object);
      return new Editor(scene);
    } catch (e) {
      console.warn(`Could not resore from autosave: ${e.message}`);
      return new Editor(fallback());
    }
  }

  constructor(scene: Scene) {
    this.scene = scene;

    Object.keys(this.commands).forEach(name => {
      this.commands[name] = action(
        `Editor.commands.${name}`,
        this.commands[name]
      );
    });
  }

  startAutosaving(): () => void {
    return autorun(
      () => {
        try {
          const object = this.scene.serialize();
          const json = JSON.stringify(object);
          localStorage.setItem(AUTOSAVE_NAME, json);
          console.log('Saved.');
        } catch (e) {
          console.warn(`couldnt autosave: ${e.message}`);
        }
      },
      { delay: 500 }
    );
  }

  enterState(newState: EditorState) {
    this.state = newState;
    this.hoveredShapes = [];
  }

  clearState() {
    this.state = { type: 'Idle' };
  }

  setHovers(hoveredShapes: Shape[]) {
    if (this.hoveredShapes.length !== 0 || hoveredShapes.length !== 0) {
      this.hoveredShapes = hoveredShapes;
    }
  }

  commands = {
    createPolygonShape: () => {
      const shape = new PolygonShape();
      this.scene.addShape(shape);
      this.enterState({
        type: 'CreatePolygonShape',
        shape,
      });
    },
    replaceDocumentWithNew: (width = 200, height = 100) => {
      this.scene = new Scene().init(width, height);
    },
  };
}

export default decorate(Editor, {
  scene: observable,
  state: observable,
  hoveredShapes: observable,
  enterState: action,
  clearState: action,
  setHovers: action,
});
