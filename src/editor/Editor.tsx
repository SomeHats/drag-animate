import { observable, action, autorun } from 'mobx';
import isEqual from 'lodash/isEqual';
import { crash } from '../util';
import Scene from '../document/Scene';
import { SelectionItem } from './SelectionItem';

const AUTOSAVE_NAME = 'drag-animate.autosave';

export enum EditorTool {
  Select = 'select',
  Pen = 'pen',
  KeyPoint = 'keyPoint',
}

class Editor {
  @observable
  tool: EditorTool = EditorTool.Select;
  @observable
  scene: Scene;
  @observable
  selection: SelectionItem[] = [];

  static fromAutoSave(fallback: () => Scene) {
    try {
      const saved = localStorage.getItem(AUTOSAVE_NAME);
      if (!saved) return crash('no autosave present');
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
      { delay: 2500 },
    );
  }

  @action
  setTool(tool: EditorTool) {
    this.tool = tool;
  }

  @action
  replaceSelection(newSelection: SelectionItem[]) {
    this.selection = newSelection;
  }

  @action
  toggleSelected(item: SelectionItem) {
    const index = this.selection.findIndex(selected => isEqual(selected, item));
    if (index != null) {
      this.selection.splice(index, 1);
    } else {
      this.selection.push(item);
    }
  }

  @action
  clearSelection() {
    this.replaceSelection([]);
  }

  @action
  replaceDocumentWithNew(width = 200, height = 100) {
    this.scene = new Scene().init(width, height);
  }
}

export default Editor;
