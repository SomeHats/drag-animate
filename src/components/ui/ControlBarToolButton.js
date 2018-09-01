// @flow
import * as React from 'react';
import ControlBarButton from './ControlBarButton';
import type Editor from '../../editor/Editor';
import { type EditorTool } from '../../editor/EditorTools';

type Props = {|
  name: string,
  shortcutKey: string,
  icon: React.Node,
  editor: Editor,
  tool: EditorTool,
|};

class ControlBarToolButton extends React.Component<Props> {
  handleClick = () => {
    const { editor, tool } = this.props;
    editor.setTool(tool);
  };

  render() {
    const { name, shortcutKey, tool, editor, icon } = this.props;

    return (
      <ControlBarButton
        name={name}
        shortcutKey={shortcutKey}
        icon={icon}
        isActive={editor.tool === tool}
        onClick={this.handleClick}
      />
    );
  }
}

export default ControlBarToolButton;
