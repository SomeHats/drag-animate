// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withViewport, Viewport } from '../viewport/ViewportProvider';
import { EditorTool } from '../../editor/Editor';
import { spawnUnknownSwitchCaseError } from '../../util';
import SelectTool from './SelectTool';
import PenTool from './PenTool';
import KeyPointTool from './KeyPointTool';

interface EditorStateInteractionProps {
  viewport: Viewport;
}

class EditorStateInteraction extends React.Component<
  EditorStateInteractionProps
> {
  render() {
    const editor = this.props.viewport.editor;
    const tool = editor.tool;

    switch (tool) {
      case EditorTool.Select:
        return <SelectTool />;
      case EditorTool.Pen:
        return <PenTool />;
      case EditorTool.KeyPoint:
        return <KeyPointTool />;
      default:
        throw spawnUnknownSwitchCaseError('EditorTool', tool);
    }
  }
}

export default withViewport(observer(EditorStateInteraction));
