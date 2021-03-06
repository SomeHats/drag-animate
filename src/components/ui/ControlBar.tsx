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
import List from '@material-ui/core/List';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import CreateIcon from '@material-ui/icons/Create';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import SaveIcon from '@material-ui/icons/SaveAlt';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import { assertExists, crash } from '../../util';
import Editor, { EditorTool } from '../../editor/Editor';
import Scene from '../../document/Scene';
import ControlBarButton from './ControlBarButton';
import ControlBarToolButton from './ControlBarToolButton';

const styles = (theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: 48,
    },
    bottomButtons: {
      marginTop: 'auto',
    },
    toolbar: theme.mixins.toolbar,
  });

interface ControlBarProps extends WithStyles<typeof styles> {
  editor: Editor;
}

class ControlBar extends React.Component<ControlBarProps> {
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
      const file = assertExists(input.files)[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = json => {
        try {
          if (typeof reader.result !== 'string')
            throw crash('result must be string');
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
            tool={EditorTool.Select}
            icon={<TouchAppIcon />}
            editor={editor}
          />
          <ControlBarToolButton
            name="Pen"
            shortcutKey="p"
            tool={EditorTool.Pen}
            icon={<CreateIcon />}
            editor={editor}
          />
          <ControlBarToolButton
            name="Key Points"
            shortcutKey="k"
            tool={EditorTool.KeyPoint}
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

export default withStyles(styles)(observer(ControlBar));
