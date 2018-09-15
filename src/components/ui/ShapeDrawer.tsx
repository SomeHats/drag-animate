// @flow
import React from 'react';
import { observer } from 'mobx-react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { spawnUnknownSwitchCaseError } from '../../util';
import Editor from '../../editor/Editor';
import { SelectionItemType } from '../../editor/SelectionItem';
import ShapeProperties from './ShapeProperties';

const styles = (theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: 300,
    },
    addButton: {
      position: 'absolute',
      bottom: 2 * theme.spacing.unit,
      right: 2 * theme.spacing.unit,
    },
    toolbar: theme.mixins.toolbar,
  });

interface ShapeDrawerProps extends WithStyles<typeof styles> {
  editor: Editor;
}

class ShapeDrawer extends React.Component<ShapeDrawerProps> {
  getFirstSelectedShape(editor: Editor) {
    const selection = editor.selection;
    if (!selection || selection.length < 1) return null;

    const firstSelected = selection[0];
    switch (firstSelected.type) {
      case SelectionItemType.Shape:
        return firstSelected.shape;
      case SelectionItemType.MagicPointThingy:
        return firstSelected.inShape;
      case SelectionItemType.ControlPoint:
        return firstSelected.inShape;
      default:
        throw spawnUnknownSwitchCaseError('SelectionItemType', firstSelected);
    }
  }

  render() {
    const { classes, editor } = this.props;
    const selectedShape = this.getFirstSelectedShape(editor);
    return (
      <Drawer
        variant="permanent"
        anchor="right"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        {selectedShape && (
          <ShapeProperties shape={selectedShape} editor={editor} />
        )}
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

export default withStyles(styles)(observer(ShapeDrawer));
