// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type Editor from '../../models/editor/Editor';
import CreateShapeInteraction from './CreateShapeInteraction';
import IdleInteraction from './IdleInteraction';
import SelectedShapeInteraction from './SelectedShapeInteraction';

type Props = {
  editor: Editor,
};

const impossible = (value: empty) => {
  return new Error(`impossible value: ${value}`);
};

class EditorStateInteraction extends React.Component<Props> {
  render() {
    const editor = this.props.editor;
    const editorState = editor.state;

    switch (editorState.type) {
      case 'Idle':
        // return <IdleInteraction editor={editor} />;
        return null;
      case 'CreateShape':
        return (
          <CreateShapeInteraction editorState={editorState} editor={editor} />
        );
      case 'ShapeSelected':
        return (
          <SelectedShapeInteraction editor={editor} shape={editorState.shape} />
        );
      default:
        throw impossible(editorState.type);
    }
  }
}

export default observer(EditorStateInteraction);
