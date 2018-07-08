// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import CreateIcon from '@material-ui/icons/Create';

import withExactProps from '../../lib/withExactProps';
import type Editor from '../../editor/Editor';
import EditorTools from '../../editor/EditorTools';
import ToolBoxButton from './ToolBoxButton';

const styles = theme => ({
  drawerPaper: {
    width: 48,
  },
  toolbar: theme.mixins.toolbar,
});

type Props = {
  editor: Editor,
  classes: { [string]: string },
};

class ToolBox extends React.Component<Props> {
  render() {
    const { classes, editor } = this.props;
    return (
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        <List>
          <ToolBoxButton
            tool={EditorTools.SELECT}
            icon={<TouchAppIcon />}
            editor={editor}
          />
          <ToolBoxButton
            tool={EditorTools.PEN}
            icon={<CreateIcon />}
            editor={editor}
          />
        </List>
      </Drawer>
    );
  }
}

export default withExactProps(withStyles(styles)(observer(ToolBox)));
