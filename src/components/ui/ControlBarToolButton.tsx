// @flow
import * as React from 'react';
import ControlBarButton from './ControlBarButton';
import Editor, { EditorTool } from '../../editor/Editor';

interface ControlBarToolButtonProps {
  name: string;
  shortcutKey: string;
  icon: React.ReactElement<any>;
  editor: Editor;
  tool: EditorTool;
}

class ControlBarToolButton extends React.Component<ControlBarToolButtonProps> {
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
