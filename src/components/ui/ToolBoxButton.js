// @flow
import * as React from "react";
import cx from "classnames";
import { observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Tooltip from "@material-ui/core/Tooltip";
import type Editor from "../../editor/Editor";
import { type EditorTool } from "../../editor/EditorTools";
import KeyboardShortcut from "../KeyboardShortcut";

type Props = {|
  name: string,
  shortcutKey: string,
  icon: React.Node,
  editor: Editor,
  tool: EditorTool,
  classes: { [string]: string }
|};

const styles = theme => ({
  listItem: {
    padding: theme.spacing.unit * 1.5
  },
  active: {
    color: theme.palette.primary.light
  },
  inactive: {
    color: theme.palette.text.primary
  },
  popper: {
    // marginLeft: 40,
  }
});

class ToolBoxButton extends React.Component<Props> {
  handleClick = () => {
    const { editor, tool } = this.props;
    editor.setTool(tool);
  };

  render() {
    const { name, shortcutKey, tool, editor, icon, classes } = this.props;

    return (
      <>
        <KeyboardShortcut name={shortcutKey} onDown={this.handleClick} />
        <Tooltip
          title={`${name} (${shortcutKey.toUpperCase()})`}
          placement="right"
          classes={{ popper: classes.popper }}
        >
          <ListItem
            button
            classes={{
              root: cx(classes.listItem, {
                [classes.active]: tool === editor.tool
              })
            }}
            onClick={this.handleClick}
          >
            <ListItemIcon
              classes={{
                root: tool === editor.tool ? classes.active : classes.inactive
              }}
            >
              {icon}
            </ListItemIcon>
          </ListItem>
        </Tooltip>
      </>
    );
  }
}

export default withStyles(styles)(observer(ToolBoxButton));
