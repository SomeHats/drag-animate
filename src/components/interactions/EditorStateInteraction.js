// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type Editor from '../../models/editor/Editor';
import CreatePolygoneInteraction from './CreatePolygonInteraction';
import IdleInteraction from './IdleInteraction';

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
      case 'CreatePolygonShape':
        return (
          <CreatePolygoneInteraction
            editorState={editorState}
            editor={editor}
          />
        );
      case 'Idle':
        return <IdleInteraction editor={editor} />;
      default:
        throw impossible(editorState.type);
    }
  }
}

export default observer(EditorStateInteraction);
