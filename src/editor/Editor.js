// @flow
import { decorate, observable, action, autorun } from "mobx";
import isEqual from "lodash/isEqual";
// import { autorunAsync } from 'mobx-utils';
import invariant from "invariant";
import Scene from "../document/Scene";
import EditorTools, { type EditorTool } from "./EditorTools";
import { type SelectionItem } from "./SelectionItem";

const AUTOSAVE_NAME = "drag-animate.autosave";

class Editor {
  tool: EditorTool = EditorTools.SELECT;
  scene: Scene;
  selection: SelectionItem[] = [];

  static fromAutoSave(fallback: () => Scene) {
    try {
      const saved = localStorage.getItem(AUTOSAVE_NAME);
      invariant(saved != null, "no autosave present");
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
          console.log("Saved.");
        } catch (e) {
          console.warn(`couldnt autosave: ${e.message}`);
        }
      },
      { delay: 2500 }
    );
  }

  setTool(tool: EditorTool) {
    this.tool = tool;
  }

  replaceSelection(newSelection: SelectionItem[]) {
    this.selection = newSelection;
  }

  toggleSelected(item: SelectionItem) {
    const index = this.selection.findIndex(selected => isEqual(selected, item));
    if (index != null) {
      this.selection.splice(index, 1);
    } else {
      this.selection.push(item);
    }
  }

  clearSelection() {
    this.replaceSelection([]);
  }

  commands = {
    replaceDocumentWithNew: (width = 200, height = 100) => {
      this.scene = new Scene().init(width, height);
    }
  };
}

export default decorate(Editor, {
  scene: observable,
  tool: observable,
  selection: observable,
  setTool: action,
  replaceSelection: action,
  clearSelection: action,
  toggleSelected: action
});
