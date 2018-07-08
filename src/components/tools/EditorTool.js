// @flow
import React from 'react';
import { observer } from 'mobx-react';
import withExactProps from '../../lib/withExactProps';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import SelectTool from './SelectTool';
import PenTool from './PenTool';

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

export default withExactProps(withViewport(observer(EditorStateInteraction)));
