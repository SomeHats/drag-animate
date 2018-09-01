// @flow
import React from 'react';
import invariant from 'invariant';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import CreateIcon from '@material-ui/icons/Create';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import SaveIcon from '@material-ui/icons/SaveAlt';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import withExactProps from '../../lib/withExactProps';
import type Editor from '../../editor/Editor';
import EditorTools from '../../editor/EditorTools';
import Scene from '../../document/Scene';
import ControlBarButton from './ControlBarButton';
import ControlBarToolButton from './ControlBarToolButton';

const styles = theme => ({
  drawerPaper: {
    width: 48,
  },
  bottomButtons: {
    marginTop: 'auto',
  },
  toolbar: theme.mixins.toolbar,
});

type Props = {
  editor: Editor,
  classes: { [string]: string },
};

class ControlBar extends React.Component<Props> {
  onSave = () => {
    const object = this.props.editor.scene.serialize();
    const json = JSON.stringify(object);
    const link = document.createElement('a');
    link.href = `data:application/json,${encodeURIComponent(json)}`;
    link.download = 'Drag Animate Save.json';
    link.click();
  };

  onOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = json => {
        try {
          invariant(typeof reader.result === 'string', 'result must be string');
          const object = JSON.parse(reader.result);
          this.props.editor.scene = Scene.deserialize(object);
        } catch (e) {
          alert('Error reading json');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

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
          <ControlBarToolButton
            name="Select"
            shortcutKey="v"
            tool={EditorTools.SELECT}
            icon={<TouchAppIcon />}
            editor={editor}
          />
          <ControlBarToolButton
            name="Pen"
            shortcutKey="p"
            tool={EditorTools.PEN}
            icon={<CreateIcon />}
            editor={editor}
          />
          <ControlBarToolButton
            name="Key Points"
            shortcutKey="k"
            tool={EditorTools.KEY_POINT}
            icon={<GpsNotFixedIcon />}
            editor={editor}
          />
        </List>
        <List className={classes.bottomButtons}>
          <ControlBarButton
            name="Save"
            shortcutKey="s"
            cmdKey
            icon={<SaveIcon />}
            isActive={false}
            onClick={this.onSave}
          />
          <ControlBarButton
            name="Open"
            shortcutKey="o"
            cmdKey
            icon={<OpenIcon />}
            isActive={false}
            onClick={this.onOpen}
          />
        </List>
      </Drawer>
    );
  }
}

export default withExactProps(withStyles(styles)(observer(ControlBar)));
