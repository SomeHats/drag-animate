// @flow
import * as React from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import type Editor from '../../models/editor/Editor';
import { type EditorTool } from '../../models/editor/EditorTools';

type Props = {|
  icon: React.Node,
  editor: Editor,
  tool: EditorTool,
  classes: { [string]: string },
|};

const styles = theme => ({
  listItem: {
    padding: theme.spacing.unit * 1.5,
  },
  active: {
    color: theme.palette.primary.light,
  },
  inactive: {
    color: theme.palette.text.primary,
  },
});

class ToolBoxButton extends React.Component<Props> {
  handleClick = () => {
    const { editor, tool } = this.props;
    editor.setTool(tool);
  };

  render() {
    const { tool, editor, icon, classes } = this.props;
    console.log({ classes });

    return (
      <ListItem
        button
        classes={{
          root: cx(classes.listItem, {
            [classes.active]: tool === editor.tool,
          }),
        }}
        onClick={this.handleClick}
      >
        <ListItemIcon
          classes={{
            root: tool === editor.tool ? classes.active : classes.inactive,
          }}
        >
          {icon}
        </ListItemIcon>
      </ListItem>
    );
  }
}

export default withStyles(styles)(observer(ToolBoxButton));
