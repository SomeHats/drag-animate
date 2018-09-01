// @flow
import * as React from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardShortcut from '../KeyboardShortcut';

type Props = {|
  name: string,
  shortcutKey: string,
  icon: React.Node,
  isActive: boolean,
  cmdKey?: boolean,
  onClick: () => mixed,
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
  popper: {
    // marginLeft: 40,
  },
});

class ControlBarButton extends React.Component<Props> {
  handleClick = () => {
    this.props.onClick();
  };

  render() {
    const { name, shortcutKey, icon, isActive, cmdKey, classes } = this.props;

    return (
      <>
        <KeyboardShortcut
          cmdKey={cmdKey == null ? false : cmdKey}
          name={shortcutKey}
          onDown={this.handleClick}
        />
        <Tooltip
          title={`${name} (${shortcutKey.toUpperCase()})`}
          placement="right"
          classes={{ popper: classes.popper }}
        >
          <ListItem
            button
            classes={{
              root: cx(classes.listItem, {
                [classes.active]: isActive,
              }),
            }}
            onClick={this.handleClick}
          >
            <ListItemIcon
              classes={{
                root: isActive ? classes.active : classes.inactive,
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

export default withStyles(styles)(observer(ControlBarButton));
