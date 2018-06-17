// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type Editor from '../../models/editor/Editor';
import EditorTools from '../../models/editor/EditorTools';
import { withViewport, type Viewport } from '../lib/ViewportProvider';
import SelectTool from './SelectTool';
import PenTool from './PenTool';
// import CreateShapeInteraction from './CreateShapeInteraction';
// import IdleInteraction from './IdleInteraction';
// import SelectedShapeInteraction from './SelectedShapeInteraction';

type Props = {
  viewport: Viewport,
};

class EditorStateInteraction extends React.Component<Props> {
  render() {
    const editor = this.props.viewport.editor;
    const tool = editor.tool;

    switch (tool) {
      case 'SELECT':
        return <SelectTool />;
      case 'PEN':
        return <PenTool />;
      default:
        throw new Error(`unknown tool: ${(tool: empty)}`);
    }
  }
}

export default withViewport(observer(EditorStateInteraction));
