// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withExactProps from '../../lib/withExactProps';
import type Editor from '../../editor/Editor';

const styles = theme => ({
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

type Props = {
  editor: Editor,
  classes: { [string]: string },
};

class ShapeDrawer extends React.Component<Props> {
  render() {
    const { classes, editor } = this.props;
    return (
      <Drawer
        variant="permanent"
        anchor="right"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        <List subheader={<ListSubheader>Shapes</ListSubheader>}>
          {editor.scene.shapes.map((shape, i) => (
            <ListItem key={i} button>
              <ListItemText>
                <pre>{JSON.stringify(shape, null, 2)}</pre>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }
}

export default withExactProps(withStyles(styles)(observer(ShapeDrawer)));
