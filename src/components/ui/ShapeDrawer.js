// @flow
import React from "react";
import { observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import type Editor from "../../editor/Editor";
import withExactProps from "../../lib/withExactProps";
import ShapeProperties from "./ShapeProperties";

const styles = theme => ({
  drawerPaper: {
    width: 300
  },
  addButton: {
    position: "absolute",
    bottom: 2 * theme.spacing.unit,
    right: 2 * theme.spacing.unit
  },
  toolbar: theme.mixins.toolbar
});

type Props = {
  editor: Editor,
  classes: { [string]: string }
};

const getFirstSelectedShape = editor => {
  const selection = editor.selection;
  if (!selection || selection.length < 1) return null;

  const firstSelected = selection[0];
  switch (firstSelected.type) {
    case "ShapeSelectionItem":
      return firstSelected.shape;
    case "MagicPointThingySelectionItem":
      return firstSelected.inShape;
    case "ControlPointSelectionItem":
      return firstSelected.inShape;
    default:
      throw new Error(`Unknown selection type ${(firstSelected.type: empty)}`);
  }
};

class ShapeDrawer extends React.Component<Props> {
  render() {
    const { classes, editor } = this.props;
    const selectedShape = getFirstSelectedShape(editor);
    return (
      <Drawer
        variant="permanent"
        anchor="right"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        {selectedShape && <ShapeProperties shape={selectedShape} />}
        {/* <List subheader={<ListSubheader>Shapes</ListSubheader>}>
          {editor.scene.shapes.map((shape, i) => (
            <ListItem key={i} button>
              <ListItemText>
                <pre>{JSON.stringify(shape, null, 2)}</pre>
              </ListItemText>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
    );
  }
}

export default withExactProps(withStyles(styles)(observer(ShapeDrawer)));
