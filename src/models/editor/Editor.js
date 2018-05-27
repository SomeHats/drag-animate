// @flow
import { decorate, observable, action } from 'mobx';
import type { EditorState } from './EditorState';
import type Scene from '../document/Scene';
import PolygonShape from '../document/shapes/PolygonShape';

class Editor {
  state: EditorState = { type: 'Idle' };
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;

    Object.keys(this.commands).forEach(name => {
      this.commands[name] = action(
        `Editor.commands.${name}`,
        this.commands[name]
      );
    });
  }

  enterState(newState: EditorState) {
    this.state = newState;
  }

  clearState() {
    this.state = { type: 'Idle' };
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
  };
}

export default decorate(Editor, {
  scene: observable,
  state: observable,
  enterState: action,
  clearState: action,
});
