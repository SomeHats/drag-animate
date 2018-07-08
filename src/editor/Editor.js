// @flow
import { decorate, observable, action, autorun } from 'mobx';
// import { autorunAsync } from 'mobx-utils';
import invariant from 'invariant';
import EditorTools, { type EditorTool } from './EditorTools';
import Scene from '../document/Scene';

const AUTOSAVE_NAME = 'drag-animate.autosave';

class Editor {
  tool: EditorTool = EditorTools.SELECT;
  scene: Scene;

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

  setTool(tool: EditorTool) {
    this.tool = tool;
  }

  commands = {
    replaceDocumentWithNew: (width = 200, height = 100) => {
      this.scene = new Scene().init(width, height);
    },
    // createShape: () => {
    //   const shape = new Shape();
    //   this.scene.addShape(shape);
    //   this.enterState({
    //     type: 'CreateShape',
    //     shape,
    //   });
    // },
    // selectShape: (shape: Shape) => {
    //   this.enterState({
    //     type: 'ShapeSelected',
    //     shape,
    //   });
    // },
  };
}

export default decorate(Editor, {
  scene: observable,
  tool: observable,
  hoveredShapes: observable,
  setTool: action,
  setHovers: action,
});
